package com.ssafy.chaing.rule.repository;

import com.ssafy.chaing.group.domain.GroupEntity;
import com.ssafy.chaing.rule.domain.LifeRuleEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LifeRuleRepository extends JpaRepository<LifeRuleEntity, Long> {
    Optional<LifeRuleEntity> findByGroup(GroupEntity group);
}
