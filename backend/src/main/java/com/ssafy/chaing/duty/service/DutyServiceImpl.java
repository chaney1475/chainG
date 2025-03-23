package com.ssafy.chaing.duty.service;

import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import com.ssafy.chaing.duty.controller.request.DutyFormRequest;
import com.ssafy.chaing.duty.controller.response.DutyDetailResponse;
import com.ssafy.chaing.duty.controller.response.DutyListResponse;
import com.ssafy.chaing.duty.controller.response.RemovedDutyResponse;
import com.ssafy.chaing.duty.domain.DutyAssigneeEntity;
import com.ssafy.chaing.duty.domain.DutyEntity;
import com.ssafy.chaing.duty.repository.DutyRepository;
import com.ssafy.chaing.group.domain.GroupEntity;
import com.ssafy.chaing.group.domain.GroupUserEntity;
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

    @Override
    public DutyListResponse getDuties(Long groupId) {
        // TODO: Duty 목록 조회 로직 구현
        return null;
    }

    @Override
    @Transactional
    public DutyDetailResponse creatDuty(Long groupId, DutyFormRequest request) {
        // 그룹 존재 여부 확인
        GroupEntity group = groupRepository.findById(groupId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));

        // DutyEntity 생성 (빌더를 통해 초기값 세팅)
        DutyEntity dutyEntity = DutyEntity.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .dutyTime(request.getDutyTime())
                .dayOfWeek(request.getDayOfWeek())
                .useTime(request.isUseTime())
                .group(group)
                .build();

        if (request.getAssignees() != null) {
            for (Long userId : request.getAssignees()) {
                if (!groupUserRepository.existsByGroupIdAndUserId(groupId, userId)) {
                    throw new BadRequestException(ExceptionCode.USER_NOT_IN_GROUP);
                }
                GroupUserEntity groupUser = groupUserRepository.findByGroupId(groupId).stream()
                        .filter(gu -> gu.getUser().getId().equals(userId))
                        .findFirst()
                        .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));
                DutyAssigneeEntity assignee = DutyAssigneeEntity.create(dutyEntity, groupUser);
                dutyEntity.addAssignee(assignee);
            }
        }

        DutyEntity savedDuty = dutyRepository.save(dutyEntity);
        return DutyDetailResponse.from(savedDuty);
    }

    @Override
    @Transactional
    public DutyDetailResponse updateDuty(Long dutyId, DutyFormRequest request) {
        DutyEntity dutyEntity = dutyRepository.findById(dutyId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.DUTY_NOT_FOUND));

        dutyEntity.update(request.getTitle(), request.getContent(), request.getDutyTime(), request.getDayOfWeek(), request.isUseTime());

        dutyEntity.clearAssignees();
        if (request.getAssignees() != null) {
            for (Long userId : request.getAssignees()) {
                if (!groupUserRepository.existsByGroupIdAndUserId(dutyEntity.getGroup().getId(), userId)) {
                    throw new BadRequestException(ExceptionCode.USER_NOT_IN_GROUP);
                }
                GroupUserEntity groupUser = groupUserRepository.findByGroupId(dutyEntity.getGroup().getId()).stream()
                        .filter(gu -> gu.getUser().getId().equals(userId))
                        .findFirst()
                        .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));
                DutyAssigneeEntity assignee = DutyAssigneeEntity.create(dutyEntity, groupUser);
                dutyEntity.addAssignee(assignee);
            }
        }

        DutyEntity updatedDuty = dutyRepository.save(dutyEntity);
        return DutyDetailResponse.from(updatedDuty);
    }

    @Override
    @Transactional
    public RemovedDutyResponse removeDuty(Long dutyId) {
        DutyEntity dutyEntity = dutyRepository.findById(dutyId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.DUTY_NOT_FOUND));

        dutyRepository.delete(dutyEntity);
        return new RemovedDutyResponse(dutyId);
    }
}
