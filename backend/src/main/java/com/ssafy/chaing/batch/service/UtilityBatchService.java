package com.ssafy.chaing.batch.service;

import com.ssafy.chaing.contract.domain.ContractEntity;
import com.ssafy.chaing.contract.domain.ContractStatus;
import com.ssafy.chaing.contract.domain.ContractUserEntity;
import com.ssafy.chaing.contract.domain.UtilityCardEntity;
import com.ssafy.chaing.contract.repository.ContractRepository;
import com.ssafy.chaing.fintech.controller.request.InquireBillingCommand;
import com.ssafy.chaing.fintech.dto.InquireBillingStatementsRec;
import com.ssafy.chaing.fintech.service.FintechService;
import com.ssafy.chaing.fintech.service.dto.CurrentBillingStatementDTO;
import com.ssafy.chaing.payment.domain.FeeType;
import com.ssafy.chaing.payment.domain.PaymentEntity;
import com.ssafy.chaing.payment.domain.PaymentStatus;
import com.ssafy.chaing.payment.domain.UserPaymentEntity;
import com.ssafy.chaing.payment.repository.PaymentRepository;
import com.ssafy.chaing.payment.repository.UserPaymentRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UtilityBatchService {

    private final FintechService fintechService;
    private final PaymentRepository paymentRepository;
    private final UserPaymentRepository userPaymentRepository;
    private final ContractRepository contractRepository;

    @Transactional
    public void saveCurrentWeekBillingStatement() {
        // 1. Fetch Join을 사용하여 Contract와 연관된 UtilityCard, Members를 함께 조회
        List<ContractEntity> contracts = contractRepository.findAllWithDetails(ContractStatus.CONFIRMED); // 예시 메서드명

        if (contracts.isEmpty()) {
            log.info("처리할 계약이 없습니다.");
            return;
        }

        List<PaymentEntity> paymentsToSave = new ArrayList<>();
        List<UserPaymentEntity> userPaymentsToSave = new ArrayList<>();

        for (ContractEntity contract : contracts) {
            // 계약 ID 로깅을 위해 변수 선언 (오류 발생 시에도 ID를 알 수 있도록)
            Long contractId = contract.getId(); // contract.getId()가 Long 타입이라고 가정

            UtilityCardEntity card = contract.getUtilityCard();
            // UtilityCard가 없는 경우 건너뛰기
            if (card == null) {
                log.warn("계약 ID {}에 연결된 UtilityCard 정보가 없습니다. 건너뜁니다.", contractId);
                continue;
            }

            String cardNo = card.getCardNo();
            String cvc = card.getCvc();

            // Fintech API 호출
            InquireBillingCommand command = new InquireBillingCommand(cardNo, cvc);
            List<InquireBillingStatementsRec> statements;
            try {
                statements = fintechService.inquireBillingStatements(command);
            } catch (Exception e) {
                log.error("계약 ID {} (카드번호: {})의 청구 내역 조회 중 오류 발생: {}", contractId, cardNo, e.getMessage(), e);
                continue; // 다음 계약으로
            }

            // 마지막 청구 내역 가져오기 (없을 경우 처리)
            if (statements == null || statements.isEmpty()) {
                log.warn("계약 ID {} (카드번호: {})에 대한 청구 내역이 없습니다.", contractId, cardNo);
                continue; // 다음 계약으로
            }
            InquireBillingStatementsRec lastStatement = statements.getLast();
            CurrentBillingStatementDTO dto = new CurrentBillingStatementDTO(lastStatement);

            List<ContractUserEntity> contractMembers = contract.getMembers();
            // 계약 멤버가 없는 경우, PaymentEntity 및 UserPaymentEntity 생성하지 않고 건너<0xEB><0x9B><0x84>기
            if (contractMembers == null || contractMembers.isEmpty()) {
                log.warn("계약 ID {} 에 멤버가 없어 Payment 생성을 건너뜁니다. (총 청구액: {})", contractId, dto.getTotalBalance());
                continue; // 다음 계약으로
            }

            // *** 멤버가 있는 경우에만 PaymentEntity 생성 ***
            PaymentEntity payment = PaymentEntity.builder()
                    .totalAmount(dto.getTotalBalance())
                    .month(dto.getBillingMonth())
                    .week(dto.getBillingWeek())
                    .allPaid(false)
                    .contract(contract) // 연관관계 설정
                    .feeType(FeeType.UTILITY)
                    .status(PaymentStatus.STARTED)
                    .paidAmount(0)
                    .build();
            paymentsToSave.add(payment); // 저장 목록에 추가

            int utilityRatio = contract.getUtilityRatio();
            int baseAmount = dto.getTotalBalance() / utilityRatio;
            int remainAmount = dto.getTotalBalance() % utilityRatio; // 나머지 금액 계산

            boolean remainderAssigned = false; // 나머지 금액 할당 여부 추적
            for (ContractUserEntity member : contractMembers) {
                int userAmount = baseAmount;
                // isSurplusUser 플래그가 true인 첫 사용자에게 나머지 할당
                if (!remainderAssigned && member.isSurplusUser()) {
                    userAmount = remainAmount; // 기본 분담금 + 나머지 금액
                    remainderAssigned = true;
                }

                UserPaymentEntity userPayment = UserPaymentEntity.builder()
                        .payment(payment) // 위에서 생성한 PaymentEntity 참조
                        .contractMember(member)
                        .status(PaymentStatus.STARTED)
                        .amount(userAmount)
                        .build();
                userPaymentsToSave.add(userPayment); // 저장 목록에 추가
            }
        }

        // 2. 루프 종료 후 Payment와 UserPayment 일괄 저장 (Bulk Insert)
        if (!paymentsToSave.isEmpty()) {
            // PaymentEntity 저장 (ID 생성됨)
            paymentRepository.saveAll(paymentsToSave);
            log.info("{}개의 Payment 정보 저장 완료.", paymentsToSave.size());

            // UserPaymentEntity 저장 (Payment ID 참조)
            if (!userPaymentsToSave.isEmpty()) {
                userPaymentRepository.saveAll(userPaymentsToSave);
                log.info("{}개의 UserPayment 정보 저장 완료.", userPaymentsToSave.size());
            } else {
                // 이 경우는 발생하면 안 됨 (Payment 생성 시 UserPayment도 생성되므로)
                log.warn("Payment는 저장되었으나 UserPayment 저장 목록이 비어있습니다. 로직 확인 필요.");
            }
        } else {
            log.info("저장할 신규 Payment 정보가 없습니다.");
        }

        log.info("이번 주 공과금 청구 내역 저장 배치 작업 완료.");
    }
}