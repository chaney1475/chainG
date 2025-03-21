package com.ssafy.chaing.contract.repository;

import com.ssafy.chaing.contract.domain.ContractUserEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ContractUserRepository extends JpaRepository<ContractUserEntity, Long> {
    List<ContractUserEntity> findByContractIdAndUserIdIn(Long contractId, List<Long> userIds);

    Optional<ContractUserEntity> findByContractIdAndIsSurplusUser(Long contractId, Boolean isSurplusUser);

    Optional<ContractUserEntity> findByContractIdAndUserId(Long contractId, Long userId);

    List<ContractUserEntity> findByContractId(Long contractId);

    @Query("""
                SELECT cu
                FROM ContractUserEntity cu
                JOIN FETCH cu.user u
                WHERE cu.contract.id = :contractId
                AND cu.isSurplusUser = false
            """)
    List<ContractUserEntity> findNonSurplusUsersByContractId(Long contractId);

}
