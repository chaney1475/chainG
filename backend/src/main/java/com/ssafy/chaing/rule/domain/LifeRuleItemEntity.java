package com.ssafy.chaing.rule.domain;

import com.ssafy.chaing.group.domain.GroupUserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class LifeRuleItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "life_rule_id", nullable = false)
    private LifeRuleEntity lifeRule;  // 하나의 생활룰에 여러 개의 요소 포함

    @Column(name = "content", nullable = false, length = 500)
    private String content;  // 생활룰 요소 내용

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modified_by")
    private GroupUserEntity modifiedBy;  // 마지막으로 수정한 사용자

    @Column(name = "modified_at")
    private ZonedDateTime modifiedAt;  // 마지막 수정 시각
}
