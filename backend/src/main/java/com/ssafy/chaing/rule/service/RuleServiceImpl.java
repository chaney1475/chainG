package com.ssafy.chaing.rule.service;


import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import com.ssafy.chaing.group.domain.GroupEntity;
import com.ssafy.chaing.group.domain.GroupUserEntity;
import com.ssafy.chaing.group.repository.GroupRepository;
import com.ssafy.chaing.group.repository.GroupUserRepository;
import com.ssafy.chaing.rule.controller.request.LifeRuleApproveRequest;
import com.ssafy.chaing.rule.controller.request.LifeRuleFormRequest;
import com.ssafy.chaing.rule.controller.request.LifeRuleUpdateRequest;
import com.ssafy.chaing.rule.controller.request.RecommendCategoryRequest;
import com.ssafy.chaing.rule.controller.response.LifeRuleResponse;
import com.ssafy.chaing.rule.controller.response.RecommendCategoryResponse;
import com.ssafy.chaing.rule.domain.ChangeRequestStatus;
import com.ssafy.chaing.rule.domain.LifeRuleChangeItemEntity;
import com.ssafy.chaing.rule.domain.LifeRuleChangeRequestEntity;
import com.ssafy.chaing.rule.domain.LifeRuleEntity;
import com.ssafy.chaing.rule.domain.LifeRuleItemEntity;
import com.ssafy.chaing.rule.dto.LifeRuleDto;
import com.ssafy.chaing.rule.dto.LifeRuleUpdateDto;
import com.ssafy.chaing.rule.repository.LifeRuleChangeRequestRepository;
import com.ssafy.chaing.rule.repository.LifeRuleItemRepository;
import com.ssafy.chaing.rule.repository.LifeRuleRepository;
import com.ssafy.chaing.user.domain.UserEntity;
import com.ssafy.chaing.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.time.ZonedDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

// TODO : FCM 알림 서비스 추가...
@Service
@RequiredArgsConstructor
@Slf4j
public class RuleServiceImpl implements RuleService {

    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final GroupUserRepository groupUserRepository;
    private final LifeRuleRepository lifeRuleRepository;
    private final LifeRuleItemRepository lifeRuleItemRepository;
    private final LifeRuleChangeRequestRepository lifeRuleChangeRequestRepository;

    @Override
    @Transactional
    public LifeRuleResponse createLifeRule(LifeRuleFormRequest request, Long userId) {

        UserEntity user = findUserOrThrow(userId);
        GroupEntity group = findGroupOrThrow(user);

        LifeRuleEntity lifeRule = LifeRuleEntity.builder()
                .group(group)
                .build();
        lifeRuleRepository.save(lifeRule);

        List<LifeRuleItemEntity> items = request.getRules().stream()
                .map(form -> LifeRuleItemEntity.builder()
                        .lifeRule(lifeRule)
                        .content(form.getContent())
                        .category(form.getCategory())
                        .build())
                .toList();

        lifeRuleItemRepository.saveAll(items);
        lifeRule.setItems(items);
        int totalUser = (int) groupUserRepository.countByGroup_Id(group.getId());

        LifeRuleChangeRequestEntity changeRequest = LifeRuleChangeRequestEntity.builder()
                .lifeRule(lifeRule)
                .totalGroupMember(totalUser)
//                .requestedBy(groupUser)
                .requestedAt(ZonedDateTime.now())
                .approvalCount(1)
                .status(ChangeRequestStatus.PROGRESS)
                .build();
        lifeRuleChangeRequestRepository.save(changeRequest);

        return LifeRuleResponse.fromDTO(convertToDtoList(items));
    }

    @Override
    public LifeRuleResponse getLifeRules(Long userId) {
        UserEntity user = findUserOrThrow(userId);
        GroupEntity group = findGroupOrThrow(user);
        LifeRuleEntity lifeRule = findLifeRuleOrThrow(group);

        List<LifeRuleItemEntity> items = lifeRuleItemRepository.findAllByLifeRule(lifeRule);

//        return LifeRuleResponse.fromDTO(convertToDtoList(items));
        LifeRuleResponse lifeRuleResponse = LifeRuleResponse.fromDTO(convertToDtoList(items));
        log.info(" result is = {}", lifeRuleResponse);
        return lifeRuleResponse;
    }

    @Override
    @Transactional
    public List<LifeRuleUpdateDto> updateRules(LifeRuleUpdateRequest request, Long userId) {
        UserEntity user = findUserOrThrow(userId);
        GroupEntity group = findGroupOrThrow(user);
        LifeRuleEntity lifeRule = findLifeRuleOrThrow(group);

        LifeRuleChangeRequestEntity changeRequest = lifeRuleChangeRequestRepository
                .findByLifeRuleAndStatus(lifeRule, ChangeRequestStatus.PROGRESS)
                .orElseGet(() -> {
                    LifeRuleChangeRequestEntity newRequest = LifeRuleChangeRequestEntity.builder()
                            .lifeRule(lifeRule)
                            .requestedAt(ZonedDateTime.now())
                            .approvalCount(1)
                            .status(ChangeRequestStatus.PROGRESS)
                            .build();
                    return lifeRuleChangeRequestRepository.save(newRequest);
                });

        List<LifeRuleChangeItemEntity> changeItems = request.getUpdates().stream()
                .map(update -> LifeRuleChangeItemEntity.builder()
                        .changeRequest(changeRequest)
                        .ruleItemId(update.getId()) // create는 null일 수 있음
                        .newValue(update.getContent())
                        .actionType(update.getActionType())
                        .build())
                .toList();

        changeRequest.getChangeItems().addAll(changeItems);

        return changeItems.stream().map(changeItem -> {
            LifeRuleUpdateDto dto = new LifeRuleUpdateDto();
            dto.setId(changeItem.getRuleItemId());
            dto.setContent(changeItem.getNewValue());
            dto.setActionType(changeItem.getActionType());
            dto.setCategory(changeItem.getCategory());
            return dto;
        }).toList();
    }

    @Override
    public List<LifeRuleUpdateDto> getUpdateLifeRule(Long userId) {
        UserEntity user = findUserOrThrow(userId);
        GroupEntity group = findGroupOrThrow(user);
        LifeRuleEntity lifeRule = findLifeRuleOrThrow(group);

        // 현재 PROGRESS 상태의 요청만 조회
        LifeRuleChangeRequestEntity changeRequest = lifeRuleChangeRequestRepository
                .findByLifeRuleAndStatus(lifeRule, ChangeRequestStatus.PROGRESS)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.LIFE_RULE_CHANGE_REQUEST_NOT_FOUND));

        List<LifeRuleChangeItemEntity> changeItems = changeRequest.getChangeItems();

        return changeItems.stream().map(item -> {
            LifeRuleUpdateDto dto = new LifeRuleUpdateDto();
            dto.setId(item.getRuleItemId());
            dto.setContent(item.getNewValue());
            dto.setCategory(item.getCategory());
            return dto;
        }).toList();
    }

    @Override
    @Transactional
    public void approveLifeRule(LifeRuleApproveRequest request, Long userId) {
        UserEntity user = findUserOrThrow(userId);
        GroupEntity group = findGroupOrThrow(user);
        LifeRuleEntity lifeRule = findLifeRuleOrThrow(group);

        // 1. 현재 진행 중인 요청 조회 (베타락으로 처리 필요 시 여기서 처리)
        LifeRuleChangeRequestEntity changeRequest = lifeRuleChangeRequestRepository
                .findWithLockByLifeRuleAndStatus(lifeRule, ChangeRequestStatus.PROGRESS)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.LIFE_RULE_CHANGE_REQUEST_NOT_FOUND));

        if (request.isApproved()) {
            // 1-1: 승인 카운트 증가
            changeRequest.approve(changeRequest.getTotalGroupMember());

            if (changeRequest.getStatus() == ChangeRequestStatus.APPROVED) {
                // 1-2: 만장일치 승인 → 룰 항목 업데이트 처리
                for (LifeRuleChangeItemEntity changeItem : changeRequest.getChangeItems()) {
                    switch (changeItem.getActionType()) {
                        case CREATE -> {
                            LifeRuleItemEntity newItem = LifeRuleItemEntity.builder()
                                    .lifeRule(lifeRule)
                                    .content(changeItem.getNewValue())
                                    .category(changeItem.getCategory())
                                    .build();
                            lifeRuleItemRepository.save(newItem);
                        }
                        case UPDATE -> {
                            LifeRuleItemEntity target = lifeRuleItemRepository.findById(changeItem.getRuleItemId())
                                    .orElseThrow(() -> new BadRequestException(ExceptionCode.LIFE_RULE_NOT_FOUND));
                            target.update(changeItem.getNewValue(), changeItem.getCategory());
                        }
                        case DELETE -> {
                            LifeRuleItemEntity toDelete = lifeRuleItemRepository.findById(changeItem.getRuleItemId())
                                    .orElseThrow(() -> new BadRequestException(ExceptionCode.LIFE_RULE_NOT_FOUND));
                            lifeRuleItemRepository.delete(toDelete); // 또는 소프트 삭제
                        }
                    }
                }
            }

        } else {
            changeRequest.reject();
        }
    }

    @Override
    public RecommendCategoryResponse recommendCategory(RecommendCategoryRequest request) {
        // TODO : GPT 써서 request 에서 온 category 값을 이제 변환해서 반환.
        return null;
    }


    private UserEntity findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));
    }

    private GroupEntity findGroupOrThrow(UserEntity user) {
        Long groupId = user.getGroupId();
        log.info("user id is = {}", user.getId());
        log.info("group id is = {}", groupId);
//        if (groupId == null) {
//            throw new BadRequestException(ExceptionCode.USER_NOT_IN_GROUP);
//        }

//        return groupRepository.findById(groupId)
//                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));
        return groupUserRepository.findByUser_Id(user.getId())
                .map(GroupUserEntity::getGroup)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_IN_GROUP));
    }

    private LifeRuleEntity findLifeRuleOrThrow(GroupEntity group) {
        return lifeRuleRepository.findByGroup(group)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.LIFE_RULE_NOT_FOUND));
    }

    private List<LifeRuleDto> convertToDtoList(List<LifeRuleItemEntity> items) {
        return items.stream()
                .map(item -> {
                    LifeRuleDto dto = new LifeRuleDto();
                    dto.setId(item.getId());
                    dto.setContent(item.getContent());
                    dto.setCategory(item.getCategory());
                    return dto;
                })
                .toList();
    }
}
