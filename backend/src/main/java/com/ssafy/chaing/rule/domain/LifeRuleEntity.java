package com.ssafy.chaing.rule.domain;

import com.ssafy.chaing.group.domain.GroupEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@AllArgsConstructor
@Builder
@Entity(name = "life_rule")
public class LifeRuleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private GroupEntity group;

    @OneToMany(mappedBy = "lifeRule", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LifeRuleItemEntity> items;

    @Column(name = "change_request_id")
    private Long changeRequestId;  // 현재 적용되지 않은 변경 요청의 ID (승인 대기 상태)


}
