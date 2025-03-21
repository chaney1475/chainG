package com.ssafy.chaing.duty.service;

import com.ssafy.chaing.duty.repository.DutyRepository;
import com.ssafy.chaing.group.domain.GroupEntity;
import com.ssafy.chaing.group.repository.GroupRepository;
import com.ssafy.chaing.group.repository.GroupUserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DutyServiceImpl implements DutyService {

    private final DutyRepository dutyRepository;
    private final GroupRepository groupRepository;
    private final GroupUserRepository groupUserRepository;


    @Transactional
    public DutyResponse createDuty(CreateDutyRequest request) {
        // 그룹은 현재 인증된 사용자 혹은 테스트 환경에서 미리 생성된 그룹에서 가져온다고 가정
        GroupEntity group = groupRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No group found"));

        // content가 null이면 빈 문자열 처리
        String content = request.getContent() != null ? request.getContent() : "";

        // DutyEntity 생성 (빌더 사용)
        DutyEntity duty = DutyEntity.builder()
                .title(request.getTitle())
                .content(content)
                .dutyTime(request.getDutyTime())
                .dayOfWeek(request.getDayOfWeek())
                .useTime(request.isUseTime())
                .group(group)
                .build();

        // 요청에 assignees가 있다면 DutyAssigneeEntity 생성 후 duty에 추가
        if (request.getAssignees() != null) {
            for (Long groupUserId : request.getAssignees()) {
                GroupUserEntity groupUser = groupUserRepository.findById(groupUserId)
                        .orElseThrow(() -> new RuntimeException("Group user not found with id: " + groupUserId));
                DutyAssigneeEntity assignee = DutyAssigneeEntity.builder()
                        .duty(duty)
                        .groupUser(groupUser)
                        .build();
                duty.getAssignees().add(assignee);
            }
        }

        DutyEntity savedDuty = dutyRepository.save(duty);

        List<Long> assigneeIds = savedDuty.getAssignees().stream()
                .map(da -> da.getGroupUser().getId())
                .collect(Collectors.toList());

        return new DutyResponse(
                savedDuty.getId(),
                savedDuty.getTitle(),
                savedDuty.getDutyTime(),
                savedDuty.getDayOfWeek(),
                savedDuty.isUseTime(),
                assigneeIds
        );
    }
}
