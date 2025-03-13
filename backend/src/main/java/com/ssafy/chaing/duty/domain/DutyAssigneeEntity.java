package com.ssafy.chaing.duty.domain;

import com.ssafy.chaing.group.domain.GroupUserEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "duty_assignee")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DutyAssigneeEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "duty_id", nullable = false)
    private DutyEntity duty; // 당번 정보

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_user_id", nullable = false)
    private GroupUserEntity groupUser; // 그룹 내 사용자 (GroupUserEntity 사용)
}
