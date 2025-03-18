package com.ssafy.chaing.payment.domain;

import com.ssafy.chaing.common.domain.BaseEntity;
import com.ssafy.chaing.contract.domain.ContractEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction(value = "is_deleted = false")
@Entity
@Table(name = "payments")
public class PaymentEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "contract_id", nullable = false)
    private ContractEntity contract;

    @Column(name = "month", nullable = false)
    private int month; // YYYYMM 형식 (예: 202503)

    @Column(name = "week", nullable = true)
    private Integer week; // 공과금인 경우 주차 값 저장

    @Column(name = "fee_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private FeeType feeType; // RENT 또는 UTILITY 구분

    @Column(name = "payment_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Column(name = "last_attempt_date")
    private ZonedDateTime lastAttemptDate;

    @Column(name = "payment_date")
    private ZonedDateTime paymentDate; // 납부한 날짜

    @Column(name = "total_amount", nullable = false)
    private Integer totalAmount; // 총 금액 추가

    @Column(name = "paid_amount", nullable = false)
    private Integer paidAmount = 0; // 현재까지 납부된 금액

    @Column(name = "all_paid", nullable = false)
    private boolean allPaid;

    // 상태 업데이트 메서드
    public void updateStatus(PaymentStatus status) {
        this.status = status;
    }

    // paidAmount 업데이트 메서드
    public void addPaidAmount(int amount) {
        // 현재 납부 금액 증가
        this.paidAmount += amount;

        // 전체 금액이 모이면 상태 갱신
        if (this.paidAmount >= this.totalAmount) {
            this.status = PaymentStatus.PAID;
            this.allPaid = true; // 계약 상태 갱신
        }
    }


}


