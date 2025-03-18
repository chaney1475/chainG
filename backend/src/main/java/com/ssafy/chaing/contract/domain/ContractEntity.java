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
    private Long id;

    @OneToOne
    private GroupEntity group;

    @Column
    private ZonedDateTime startDate;

    @Column
    private ZonedDateTime endDate;

    @Column
    private Integer dueDate; // 매월 며칠에 납부할지 (ex. 10일)

    @Column // 집주인 계좌
    private String ownerAccountNo;

    @Column // 월세 필수
    private String rentAccountNo;

    @Column // 생활비 계좌
    private String liveAccountNo;

    @JoinColumn(name = "utility_card_id")
    @OneToOne
    private UtilityCardEntity utilityCard;

    @Column
    private Integer totalRentRatio; // 3

    @Column
    private Integer utilityRatio; // 2

    @Column
    private Integer rentTotalAmount; // 월세 총액

    @OneToMany(mappedBy = "contract")
    private List<ContractUserEntity> contractUsers;

    @Column
    private boolean completed;

    public void updateCompletedStatus() {
        boolean allConfirmed = contractUsers.stream()
                .allMatch(user -> user.getContractStatus() == ContractStatus.CONFIRMED);

        this.completed = allConfirmed;
    }
}
