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
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
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
        // TODO: Duty 목록 조회 로직 구현 -> 요청한 날짜에 대해서 그 주를 확인하고 그 주에 있는 모든 당번 목록들을 조회
        // todo : 날짜와 관련해서 질문 해봐야겠당...
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
        LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SATURDAY));

        List<DutyEntity> duties = dutyRepository.findByGroup_Id(groupId);

        List<DutyEntity> filteredDuties = duties.stream()
                .filter(duty -> {
                    // todo : 이부분 수정해야됨...
                    // 1. dutyTime이 null?? => 무조건 보내야됨.
                    // 2. LocalTime 이 아닌거 같은데
                    if (duty.getDutyTime() == null) {
                        return true;
                    }
                    LocalDate dutyDate = duty.getDutyTime().toLocalDate();
                    return !dutyDate.isBefore(startOfWeek) && !dutyDate.isAfter(endOfWeek);
                })
                .collect(Collectors.toList());

        Map<String, List<DutyDetailResponse>> groupedDuties = filteredDuties.stream()
                .collect(Collectors.groupingBy(
                        duty -> duty.getDayOfWeek().toLowerCase(),
                        Collectors.mapping(DutyDetailResponse::from, Collectors.toList())
                ));

        List<DutyDetailResponse> sunday = groupedDuties.getOrDefault("sunday", new ArrayList<>());
        List<DutyDetailResponse> monday = groupedDuties.getOrDefault("monday", new ArrayList<>());
        List<DutyDetailResponse> tuesday = groupedDuties.getOrDefault("tuesday", new ArrayList<>());
        List<DutyDetailResponse> wednesday = groupedDuties.getOrDefault("wednesday", new ArrayList<>());
        List<DutyDetailResponse> thursday = groupedDuties.getOrDefault("thursday", new ArrayList<>());
        List<DutyDetailResponse> friday = groupedDuties.getOrDefault("friday", new ArrayList<>());
        List<DutyDetailResponse> saturday = groupedDuties.getOrDefault("saturday", new ArrayList<>());

        return new DutyListResponse(sunday, monday, tuesday, wednesday, thursday, friday, saturday);
    }

    @Override
    @Transactional
    public DutyDetailResponse creatDuty(Long groupId, DutyFormRequest request) {
        GroupEntity group = groupRepository.findById(groupId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));

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
