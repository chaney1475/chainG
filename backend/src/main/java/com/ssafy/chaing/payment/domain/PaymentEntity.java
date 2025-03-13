package com.ssafy.chaing.payment.domain;

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
import lombok.Setter;


@Setter
@Entity
@Table(name = "payment")
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "contract_id", nullable = false)
    private ContractEntity contract;

    @Column(nullable = false)
    private int month; // YYYYMM 형식 (예: 202503)

    @Column
    private Integer week; // 공과금인 경우 주차 값 저장

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FeeType feeType; // RENT 또는 UTILITY 구분

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Column
    private ZonedDateTime lastAttemptDate;

    @Column
    private ZonedDateTime paymentDate; // 납부한 날짜

    @Column(nullable = false)
    private Integer totalAmount; // 총 금액 추가

    @Column(nullable = false)
    private Integer paidAmount = 0; // 현재까지 납부된 금액

    @Column(nullable = false)
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

