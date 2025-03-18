package com.ssafy.chaing.contract.domain;

import com.ssafy.chaing.common.domain.BaseEntity;
import com.ssafy.chaing.group.domain.GroupEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import java.util.List;
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
@Table(name = "contracts")
public class ContractEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

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

    @OneToMany(mappedBy = "contract")
    private List<ContractUserEntity> contractUsers;

    @Column(name = "completed", nullable = false)
    private boolean completed;

    public void updateCompletedStatus() {
        boolean allConfirmed = contractUsers.stream()
                .allMatch(user -> user.getContractStatus() == ContractStatus.CONFIRMED);

        this.completed = allConfirmed;
    }
}

