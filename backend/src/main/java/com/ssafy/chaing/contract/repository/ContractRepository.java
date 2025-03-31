package com.ssafy.chaing.contract.repository;

import com.ssafy.chaing.contract.domain.ContractEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractRepository extends JpaRepository<ContractEntity, Long> {

    @Query("""
            SELECT c FROM ContractEntity c
            JOIN FETCH c.members
            WHERE c.id = :id
            """)
    Optional<ContractEntity> findByIdWithMembers(Long id);

}
