package com.ssafy.chaing.batch.service;

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
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import lombok.RequiredArgsConstructor;
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

    private int executionHour = 18; // 기본값 오후 6시
    private int executionMinute = 0; // 기본값 0분
    private int retryDays = 1; // 기본값 1일 후 재시도
    private int retryMinutes = 0; // 기본값 30분 후 재시도

    /**
     * ✅ 다음 달 Payment 생성 및 배치 등록
     */
    @Transactional
    public void registerNextMonthPayment(ContractEntity contract) {
        log.info("📅 Payment 생성 시작 → Contract ID = {}", contract.getId());

        // 다음 실행일 계산 (14일: 공동 계좌 송금, 15일: 집주인 송금)
        ZonedDateTime collectExecution = computeNextExecutionTime(contract.getDueDate() - 1);
        ZonedDateTime ownerExecution = computeNextExecutionTime(contract.getDueDate());

        PaymentEntity payment = PaymentEntity.builder()
                .contract(contract)
                .month(ownerExecution.getYear() * 100 + ownerExecution.getMonthValue())
                .feeType(FeeType.RENT)
                .totalAmount(contract.getRentTotalAmount())
                .status(PaymentStatus.STARTED)
                .paidAmount(0)
                .build();

        payment.setNextExecutionDate(ownerExecution);
        paymentRepository.save(payment);

        // 14일 배치 등록 → 공동 계좌 모으기
        taskScheduler.schedule(() -> collectToJointAccount(payment),
                Date.from(collectExecution.toInstant()));

        // ✅ 15일 배치 등록 → 집주인 송금
        taskScheduler.schedule(() -> payToOwner(payment),
                Date.from(ownerExecution.toInstant()));

        log.info("💡 Payment 등록 완료 → Payment ID = {}, Next Execution = {}",
                payment.getId(), ownerExecution);
    }

    /**
     * ✅ 실행일 계산 (현재 날짜 기준으로 결정)
     */
    private ZonedDateTime computeNextExecutionTime(Integer dueDate) {
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));

        // ✅ 같은 달의 dueDate로 설정
        ZonedDateTime nextExecution = now
                .withDayOfMonth(dueDate)
                .withHour(executionHour)
                .withMinute(executionMinute)
                .withSecond(0);

        // ✅ 현재 날짜보다 이전이면 다음 달로 넘김
        if (nextExecution.isBefore(now)) {
            nextExecution = nextExecution.plusMonths(1)
                    .withDayOfMonth(dueDate)
                    .withHour(executionHour)
                    .withMinute(executionMinute)
                    .withSecond(0);
        }

        return nextExecution;
    }

    /**
     * ✅ 14일 → 공동 계좌로 송금 처리
     */
    @Transactional
    public void collectToJointAccount(PaymentEntity payment) {
        log.info("💰 공동 계좌로 송금 시작 → Payment ID = {}", payment.getId());

        boolean allSuccess = true;

        for (ContractUserEntity member : payment.getContract().getMembers()) {
            UserPaymentEntity userPayment = UserPaymentEntity.builder()
                    .payment(payment)
                    .contractMember(member)
                    .amount(member.getRentAmount())
                    .status(PaymentStatus.PENDING)
                    .build();

            userPaymentRepository.save(userPayment);

            // ✅ 송금 처리
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
            log.warn("❌ 공동 계좌로 송금 일부 실패 → Payment ID = {}", payment.getId());
        }

        paymentRepository.save(payment);
    }

    /**
     * ✅ 15일 → 집주인에게 송금 처리
     */
    @Transactional
    public void payToOwner(PaymentEntity payment) {
        if (payment.getStatus() == PaymentStatus.PARTIALLY_PAID) {
            log.warn("⚠️ 공동 계좌 모으기 실패 상태. 재시도 수행 → Payment ID = {}", payment.getId());
            collectToJointAccount(payment);
        }

        if (payment.getStatus() != PaymentStatus.COLLECTED) {
            log.warn("⚠️ Payment ID {} 상태가 COLLECTED가 아님. 송금 불가", payment.getId());
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
            log.error("🚨 집주인 송금 실패 → Payment ID = {}", payment.getId());
            registerRetryPayment(payment);
        }

        paymentRepository.save(payment);
    }

    /**
     * 실패한 송금 재시도 처리
     */
    private void registerRetryPayment(PaymentEntity payment) {
        if (payment.getRetryCount() >= 20) {
            payment.updateStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            log.warn("❌ Payment ID {} → 최대 재시도 횟수 도달", payment.getId());
            return;
        }

        payment.increaseRetryCount();

        // ✅ 외부에서 주입된 값으로 재시도 시간 계산
        ZonedDateTime retryExecution = ZonedDateTime.now()
                .plusDays(retryDays)
                .plusMinutes(retryMinutes);

        taskScheduler.schedule(() -> payToOwner(payment),
                Date.from(retryExecution.toInstant()));

        log.info("🔁 {}일 {}분 후 재시도 등록 → Payment ID = {}, Retry Count = {}",
                retryDays, retryMinutes, payment.getId(), payment.getRetryCount());
    }

    /**
     * 실행 시간을 외부에서 주입받아 테스트 가능하도록 설정합니다. 실제 배포에서는 기본값(18:00)으로 설정합니다.
     *
     * @param hour   - 실행 시간
     * @param minute - 실행 분
     */
    public void setExecutionTime(int hour, int minute) {
        if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            throw new IllegalArgumentException("Invalid execution time");
        }
        this.executionHour = hour;
        this.executionMinute = minute;
        log.info("✅ 실행 시간 설정 완료 → 시간 = {}시 {}분", hour, minute);
    }

    /**
     * 재시도 시간을 외부에서 주입받아 테스트 가능하도록 설정합니다.
     *
     * @param days    - 재시도까지 대기 일 수
     * @param minutes - 재시도까지 대기 분 수
     */
    public void setRetryInterval(int days, int minutes) {
        if (days < 0 || minutes < 0 || minutes > 59) {
            throw new IllegalArgumentException("Invalid retry interval");
        }
        this.retryDays = days;
        this.retryMinutes = minutes;
        log.info("✅ 재시도 간격 설정 완료 → {}일 {}분 후", days, minutes);
    }

}
