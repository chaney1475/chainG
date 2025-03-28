package com.ssafy.chaing.batch.service;

import com.ssafy.chaing.batch.config.ExecutionTime;
import com.ssafy.chaing.contract.domain.ContractEntity;
import com.ssafy.chaing.contract.domain.ContractUserEntity;
import com.ssafy.chaing.fintech.controller.request.TransferCommand;
import com.ssafy.chaing.fintech.service.FintechService;
import com.ssafy.chaing.fintech.service.dto.TransferDTO;
import com.ssafy.chaing.payment.domain.FeeType;
import com.ssafy.chaing.payment.domain.PaymentEntity;
import com.ssafy.chaing.payment.domain.PaymentStatus;
import com.ssafy.chaing.payment.domain.UserPaymentEntity;
import com.ssafy.chaing.payment.repository.PaymentRepository;
import com.ssafy.chaing.payment.repository.UserPaymentRepository;
import java.time.ZonedDateTime;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RentBatchService {

    private final FintechService fintechService;
    private final PaymentRepository paymentRepository;
    private final UserPaymentRepository userPaymentRepository;
    private final TaskScheduler taskScheduler;

    @Setter
    private ExecutionTime collectTime = new ExecutionTime(18, 0, -1);
    @Setter
    private ExecutionTime payTime = new ExecutionTime(18, 0, 0);
    @Setter
    private ExecutionTime retryTime = new ExecutionTime(0, 0, 1);

    @Transactional
    public void registerNextMonthPayment(ContractEntity contract) {
        log.info("📅 Payment 생성 시작 → Contract ID = {}", contract.getId());

        ZonedDateTime collectExecution = collectTime.calculate(contract.getDueDate());
        ZonedDateTime ownerExecution = payTime.calculate(contract.getDueDate());

        PaymentEntity payment = PaymentEntity.builder()
                .contract(contract)
                .month(ownerExecution.getYear() * 100 + ownerExecution.getMonthValue())
                .feeType(FeeType.RENT)
                .totalAmount(contract.getRentTotalAmount())
                .status(PaymentStatus.STARTED)
                .paidAmount(0)
                .retryCount(0)
                .build();

        payment.setNextExecutionDate(ownerExecution);
        paymentRepository.save(payment);

        Long paymentId = payment.getId();

        for (ContractUserEntity member : contract.getMembers()) {
            UserPaymentEntity userPayment = UserPaymentEntity.builder()
                    .payment(payment)
                    .contractMember(member)
                    .amount(member.getRentAmount())
                    .status(PaymentStatus.PENDING)
                    .build();
            userPaymentRepository.save(userPayment);
        }

        taskScheduler.schedule(() -> collectToJointAccount(paymentId),
                collectExecution.toInstant());

        taskScheduler.schedule(() -> payToOwner(paymentId),
                ownerExecution.toInstant());

        log.info("💡 Payment 등록 완료 → Payment ID = {}, Next Execution = {}",
                paymentId, ownerExecution);
    }

    @Transactional
    public void payToOwner(Long paymentId) {
        PaymentEntity payment = paymentRepository.findWithContractAndMembersById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 Payment"));

        log.info("💰 *당일 작업!* 공동 계좌로 모으기와 집주인 계좌 송금 둘 다 → Payment ID = {}", payment.getId());

        if (payment.getStatus() == PaymentStatus.PARTIALLY_PAID) {
            log.warn("⚠️ 공동 계좌 모으기 실패 상태. 재시도 수행 → Payment ID = {}", payment.getId());
            collectToJointAccount(payment);
        }

        if (payment.getStatus() != PaymentStatus.COLLECTED) {
            log.warn("⚠️ Payment ID {} 상태가 COLLECTED가 아닌 경우. 송금 불가, 재시도 등록", payment.getId());
            registerRetryPayment(payment);
            return;
        }

        log.info("💰 집주인에게 송금 시작 → Payment ID = {}", payment.getId());

        TransferDTO result = fintechService.transfer(
                new TransferCommand(
                        payment.getContract().getRentAccountNo(),
                        payment.getContract().getOwnerAccountNo(),
                        payment.getTotalAmount()
                )
        );

        if (result.isSuccess()) {
            payment.updateStatus(PaymentStatus.PAID);
            log.info("✅ 집주인 송금 성공 → Payment ID = {}", payment.getId());
        } else {
            payment.updateStatus(PaymentStatus.RETRY_PENDING);
            registerRetryPayment(payment);
        }

        if (payment.getStatus() != PaymentStatus.COLLECTED) {
            log.warn("⚠️ Payment ID {} 상태가 COLLECTED가 아닌 경우. 송금 불가, 재시도 등록", payment.getId());
            registerRetryPayment(payment);
            return;
        }

        paymentRepository.save(payment);
    }

    @Transactional
    public void collectToJointAccount(Long paymentId) {
        PaymentEntity payment = paymentRepository.findWithContractAndMembersById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 Payment"));
        collectToJointAccountInternal(payment);
    }

    @Transactional
    public void collectToJointAccount(PaymentEntity payment) {
        collectToJointAccountInternal(payment);
    }

    private void collectToJointAccountInternal(PaymentEntity payment) {
        log.info("💰 *전날 작업!* 공동 계좌로 송금 시작 → Payment ID = {}", payment.getId());

        boolean allSuccess = true;

        Map<Long, UserPaymentEntity> userPaymentMap = userPaymentRepository
                .findWithMemberAndUserByPaymentId(payment.getId())
                .stream()
                .collect(Collectors.toMap(
                        up -> up.getContractMember().getId(),
                        up -> up
                ));

        for (ContractUserEntity member : payment.getContract().getMembers()) {
            UserPaymentEntity userPayment = userPaymentMap.get(member.getId());

            if (userPayment == null) {
                log.error("🚨 해당 멤버의 UserPayment가 없음 → memberId={}, paymentId={}", member.getId(), payment.getId());
                allSuccess = false;
                continue;
            }

            // 이미 처리된 경우 건너뛰기 (재시도 방지용)
            if (userPayment.getStatus() == PaymentStatus.PAID || userPayment.getStatus() == PaymentStatus.COLLECTED) {
                continue;
            }

            TransferDTO result = fintechService.transfer(
                    new TransferCommand(
                            member.getAccountNo(),
                            payment.getContract().getRentAccountNo(),
                            member.getRentAmount()
                    )
            );

            if (result.isSuccess()) {
                userPayment.updateStatus(PaymentStatus.COLLECTED);
                payment.addPaidAmount(member.getRentAmount());
            } else {
                userPayment.updateStatus(PaymentStatus.FAILED);
                allSuccess = false;
            }

            userPaymentRepository.save(userPayment);
        }

        if (allSuccess) {
            payment.updateStatus(PaymentStatus.COLLECTED);
            log.info("✅ 공동 계좌로 송금 성공 → Payment ID = {}", payment.getId());
        } else {
            payment.updateStatus(PaymentStatus.PARTIALLY_PAID);
            log.warn("❌ 일부 송금 실패 → Payment ID = {}", payment.getId());
        }

        paymentRepository.save(payment);
    }


    private void registerRetryPayment(PaymentEntity payment) {

        if (payment.getRetryCount() >= 5) {
            payment.updateStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            log.warn("❌ Payment ID {} → 최대 재시도 횟수 도달", payment.getId());
            return;
        }

        log.info("🔢 retryCount 증가 전 = {}, Payment ID = {}", payment.getRetryCount(), payment.getId());
        payment.increaseRetryCount();
        log.info("🔼 retryCount 증가 후 = {}", payment.getRetryCount());

        ZonedDateTime retryExecution = retryTime.calculateFromNow();

        paymentRepository.save(payment);

        taskScheduler.schedule(() -> payToOwner(payment.getId()),
                retryExecution.toInstant());

        log.info("🔁 {}일 {}분 후 재시도 등록 → Payment ID = {}, Retry Count = {}",
                retryTime.getHour(), retryTime.getMinute(), payment.getId(), payment.getRetryCount());

    }

}
