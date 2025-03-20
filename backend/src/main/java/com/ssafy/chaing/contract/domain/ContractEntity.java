package com.ssafy.chaing.contract.domain;

import com.ssafy.chaing.common.domain.BaseEntity;
import com.ssafy.chaing.group.domain.GroupEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

@Setter
@Getter
@AllArgsConstructor
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction(value = "is_deleted = false")
@Entity
@Table(name = "contracts")
public class ContractEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    // DRAFT -> 최종 제출 (PENDING) -> 3명이 합의를 해 -> COMPLETE
    //                            -> 거절 -> 결정을 유예

    @OneToOne
    @JoinColumn(name = "group_id", nullable = true)
    private GroupEntity group;

    @Column(name = "start_date", nullable = true)
    private ZonedDateTime startDate;

    @Column(name = "end_date", nullable = true)
    private ZonedDateTime endDate;

    @Column(name = "due_date", nullable = true) // 매월 며칠에 납부할지 (ex. 10일)
    private Integer dueDate;

    @Column(name = "owner_account_no", nullable = true) // 집주인 계좌
    private String ownerAccountNo;

    @Column(name = "rent_account_no", nullable = true) // 월세 필수 계좌
    private String rentAccountNo;

    @Column(name = "live_account_no", nullable = true) // 생활비 계좌
    private String liveAccountNo;

    @JoinColumn(name = "utility_card_id", nullable = true)
    @OneToOne
    private UtilityCardEntity utilityCard;

    @Column(name = "total_rent_ratio", nullable = true) // 3
    private Integer totalRentRatio;

    @Column(name = "utility_ratio", nullable = true) // 2
    private Integer utilityRatio;

    @Column(name = "rent_total_amount", nullable = true) // 월세 총액
    private Integer rentTotalAmount;

    @OneToMany(mappedBy = "contract", cascade = CascadeType.PERSIST)
    private List<ContractUserEntity> contractUsers = new ArrayList<>();

    @Column(name = "completed", nullable = false)
    private boolean completed;

    @Column(name = "completed_at")
    private ZonedDateTime completedAt;

    public void updateCompletedStatus() {
        boolean allConfirmed = contractUsers.stream()
                .allMatch(user -> user.getContractStatus() == ContractStatus.CONFIRMED);

        this.completed = allConfirmed;
        this.completedAt = ZonedDateTime.now(ZoneId.of("UTC"));
    }

    public void add(ContractUserEntity contractUser) {
        contractUsers.add(contractUser);
    }

    public void remove(ContractUserEntity contractUser) {
        contractUsers.remove(contractUser);
    }

    public void addAll(List<ContractUserEntity> contractUsers) {
        this.contractUsers.addAll(contractUsers);
    }

    public void removeAll(List<ContractUserEntity> contractUsers) {
        this.contractUsers.removeAll(contractUsers);
    }
}

