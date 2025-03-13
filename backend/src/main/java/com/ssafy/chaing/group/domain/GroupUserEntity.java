package com.ssafy.chaing.group.domain;

import com.ssafy.chaing.duty.domain.DutyAssigneeEntity;
import com.ssafy.chaing.user.domain.UserEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;

@Table
@Entity(name = "group_user")
public class GroupUserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private GroupEntity group;

    @OneToMany(mappedBy = "groupUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DutyAssigneeEntity> dutyAssignments = new HashSet<>(); // 당번 할당 목록

}
