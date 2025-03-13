package com.ssafy.chaing.contract.domain;

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
import java.time.ZonedDateTime;
import lombok.Getter;

@Entity
public class ContractUserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "contract_id")
    private ContractEntity contract;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Getter
    @Enumerated(EnumType.STRING)
    private ContractStatus contractStatus;

    @Column(nullable = false)
    private boolean isSurplusUser; // 자투리 유저 여부

    @Column
    private ZonedDateTime confirmedAt;

    @Column
    private String accountAddress;

    @Column
    private Integer rentRatio; // 1

    @Column
    private Integer rentAmount; // 3333원

    @Column
    private Double utilityRatio; // 1

    public void updateContractStatus(ContractStatus status) {
        this.contractStatus = status;
        this.contract.updateCompletedStatus();
    }

}

