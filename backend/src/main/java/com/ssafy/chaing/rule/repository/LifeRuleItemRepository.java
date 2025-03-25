package com.ssafy.chaing.rule.repository;

import com.ssafy.chaing.rule.domain.LifeRuleEntity;
import com.ssafy.chaing.rule.domain.LifeRuleItemEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LifeRuleItemRepository extends JpaRepository<LifeRuleItemEntity, Long> {
    List<LifeRuleItemEntity> findAllByLifeRule(LifeRuleEntity lifeRule);
}
