package com.ssafy.chaing.contract.domain;

import com.ssafy.chaing.common.domain.BaseEntity;
import com.ssafy.chaing.user.domain.UserEntity;
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
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

@Getter
@AllArgsConstructor
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction(value = "is_deleted = false")
@Entity
@Table(name = "contract_user")
public class ContractUserEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "contract_id", nullable = false)
    private ContractEntity contract;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Getter
    @Enumerated(EnumType.STRING)
    @Column(name = "contract_status", nullable = false)
    private ContractStatus contractStatus;

    @Column(name = "is_surplus_user", nullable = false) // 자투리 유저 여부
    private boolean isSurplusUser;

    @Column(name = "confirmed_at", nullable = true) // 확인된 시간
    private ZonedDateTime confirmedAt;

    @Column(name = "account_no", nullable = true) // 계좌 번호
    private String accountNo;

    @Column(name = "rent_ratio", nullable = false) // 월세 비율 (예: 1)
    private Integer rentRatio;

    @Column(name = "rent_amount", nullable = false) // 월세 금액 (예: 3333원)
    private Integer rentAmount;

    @Column(name = "utility_ratio", nullable = false) // 공과금 비율 (예: 1)
    private Integer utilityRatio;

    public void updateContractStatus(ContractStatus status) {
        this.contractStatus = status;
        this.contract.updateCompletedStatus();
    }

}

