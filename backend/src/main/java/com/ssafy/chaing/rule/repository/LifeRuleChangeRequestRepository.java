package com.ssafy.chaing.rule.repository;

import com.ssafy.chaing.rule.domain.ChangeRequestStatus;
import com.ssafy.chaing.rule.domain.LifeRuleChangeRequestEntity;
import com.ssafy.chaing.rule.domain.LifeRuleEntity;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LifeRuleChangeRequestRepository extends JpaRepository<LifeRuleChangeRequestEntity, Long> {
    Optional<LifeRuleChangeRequestEntity> findByLifeRuleAndStatus(LifeRuleEntity lifeRule, ChangeRequestStatus status);

    //LockModeType.PESSIMISTIC_WRITE 의 의미 : 읽고 수정하려는 의도를 가진 트랜잭션이 락을 잡는다
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM LifeRuleChangeRequestEntity r WHERE r.lifeRule = :lifeRule AND r.status = :status")
    Optional<LifeRuleChangeRequestEntity> findWithLockByLifeRuleAndStatus(@Param("lifeRule") LifeRuleEntity lifeRule,
                                                                          @Param("status") ChangeRequestStatus status);
}
