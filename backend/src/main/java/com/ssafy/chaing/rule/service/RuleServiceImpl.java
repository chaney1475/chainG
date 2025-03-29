package com.ssafy.chaing.rule.service;

import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import com.ssafy.chaing.group.domain.GroupEntity;
import com.ssafy.chaing.group.domain.GroupUserEntity;
import com.ssafy.chaing.group.repository.GroupUserRepository;
import com.ssafy.chaing.rule.controller.request.LifeRuleApproveRequest;
import com.ssafy.chaing.rule.controller.request.LifeRuleFormRequest;
import com.ssafy.chaing.rule.controller.request.LifeRuleUpdateRequest;
import com.ssafy.chaing.rule.controller.response.LifeRuleResponse;
import com.ssafy.chaing.rule.domain.ChangeRequestStatus;
import com.ssafy.chaing.rule.domain.LifeRuleChangeItemEntity;
import com.ssafy.chaing.rule.domain.LifeRuleChangeRequestEntity;
import com.ssafy.chaing.rule.domain.LifeRuleEntity;
import com.ssafy.chaing.rule.domain.LifeRuleItemEntity;
import com.ssafy.chaing.rule.domain.LifeRuleUserEntity;
import com.ssafy.chaing.rule.dto.LifeRuleDto;
import com.ssafy.chaing.rule.dto.LifeRuleUpdateDto;
import com.ssafy.chaing.rule.repository.LifeRuleChangeItemRepository;
import com.ssafy.chaing.rule.repository.LifeRuleChangeRequestRepository;
import com.ssafy.chaing.rule.repository.LifeRuleItemRepository;
import com.ssafy.chaing.rule.repository.LifeRuleRepository;
import com.ssafy.chaing.rule.repository.LifeRuleUserRepository;
import com.ssafy.chaing.user.domain.UserEntity;
import jakarta.transaction.Transactional;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

// TODO : FCM 알림 서비스 추가...
@Service
@RequiredArgsConstructor
@Slf4j
public class RuleServiceImpl implements RuleService {

    private final GroupUserRepository groupUserRepository;
    private final LifeRuleRepository lifeRuleRepository;
    private final LifeRuleItemRepository lifeRuleItemRepository;
    private final LifeRuleChangeRequestRepository lifeRuleChangeRequestRepository;
    private final LifeRuleChangeItemRepository lifeRuleChangeItemRepository;
    private final LifeRuleUserRepository lifeRuleUserRepository;

    @Override
    @Transactional
    public LifeRuleResponse createLifeRule(LifeRuleFormRequest request, Long userId) {
        GroupEntity group = groupUserRepository.findByUserIdWithGroup(userId)
                .map(GroupUserEntity::getGroup)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_IN_GROUP));

        if (lifeRuleRepository.findByGroup(group).isPresent()) {
            throw new BadRequestException(ExceptionCode.LIFE_RULE_ALREADY_EXISTS);
        }

        LifeRuleEntity lifeRule = LifeRuleEntity.builder()
                .group(group)
                .build();
        lifeRuleRepository.save(lifeRule);

        Set<UserEntity> groupUsers = groupUserRepository.findAllUsersInGroupByUserId(userId);
        Set<LifeRuleUserEntity> lifeRuleUserEntities = groupUsers.stream()
                .map(u -> LifeRuleUserEntity.builder()
                        .user(u)
                        .lifeRule(lifeRule)
                        .isVoted(false)
                        .build())
                .collect(Collectors.toSet());
        lifeRule.setLifeRuleUsers(lifeRuleUserEntities);

        Set<LifeRuleItemEntity> items = request.getRules().stream()
                .map(form -> LifeRuleItemEntity.builder()
                        .lifeRule(lifeRule)
                        .content(form.getContent())
                        .category(form.getCategory())
                        .build())
                .collect(Collectors.toSet());
        lifeRuleItemRepository.saveAll(items);
        lifeRule.setItems(items);

        LifeRuleChangeRequestEntity changeRequest = LifeRuleChangeRequestEntity.builder()
                .lifeRule(lifeRule)
                .totalGroupMember(groupUsers.size())
                .requestedAt(ZonedDateTime.now())
                .approvalCount(1)
                .status(ChangeRequestStatus.PROGRESS)
                .build();
        lifeRuleChangeRequestRepository.save(changeRequest);

        return LifeRuleResponse.fromDTO(convertToDtoSet(items));
    }

    @Override
    public LifeRuleResponse getLifeRules(Long userId) {
        LifeRuleEntity lifeRule = findLifeRuleByUserIdOrThrow(userId);
        Set<LifeRuleItemEntity> items = lifeRuleItemRepository.findAllByLifeRule(lifeRule);
        return LifeRuleResponse.fromDTO(convertToDtoSet(items));
    }

    @Override
    @Transactional
    public List<LifeRuleUpdateDto> updateRules(LifeRuleUpdateRequest request, Long userId) {
        LifeRuleEntity lifeRule = findLifeRuleByUserIdOrThrow(userId);

        LifeRuleChangeRequestEntity changeRequest = lifeRuleChangeRequestRepository
                .findByLifeRule(lifeRule)
                .orElseGet(() -> {
                    LifeRuleChangeRequestEntity newRequest = LifeRuleChangeRequestEntity.builder()
                            .lifeRule(lifeRule)
                            .requestedAt(ZonedDateTime.now())
                            .approvalCount(1)
                            .status(ChangeRequestStatus.PROGRESS)
                            .build();
                    return lifeRuleChangeRequestRepository.save(newRequest);
                });

        LifeRuleUserEntity lifeRuleUserEntity = lifeRuleUserRepository
                .findByLifeRuleAndUserId(lifeRule, userId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.LIFE_RULE_USER_NOT_FOUND));
        lifeRuleUserEntity.setVoted(true);

        List<LifeRuleChangeItemEntity> changeItems = request.getUpdates().stream()
                .map(update -> LifeRuleChangeItemEntity.builder()
                        .changeRequest(changeRequest)
                        .ruleItemId(update.getId())
                        .newValue(update.getContent())
                        .category(update.getCategory())
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
        }).collect(Collectors.toList());
    }

    @Override
    public List<LifeRuleUpdateDto> getUpdateLifeRule(Long userId) {
        LifeRuleEntity lifeRule = findLifeRuleByUserIdOrThrow(userId);
        LifeRuleChangeRequestEntity changeRequest = lifeRuleChangeRequestRepository
                .findByLifeRuleAndStatus(lifeRule, ChangeRequestStatus.PROGRESS)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.LIFE_RULE_CHANGE_REQUEST_NOT_FOUND));

        List<LifeRuleChangeItemEntity> changeItems =
                lifeRuleChangeItemRepository.findNotDeletedByChangeRequest(changeRequest);
        return changeItems.stream().map(item -> {
            LifeRuleUpdateDto dto = new LifeRuleUpdateDto();
            dto.setId(item.getRuleItemId());
            dto.setContent(item.getNewValue());
            dto.setCategory(item.getCategory());
            dto.setActionType(item.getActionType());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void approveLifeRule(LifeRuleApproveRequest request, Long userId) {
        LifeRuleEntity lifeRule = findLifeRuleByUserIdOrThrow(userId);

        LifeRuleUserEntity lifeRuleUserEntity = lifeRuleUserRepository
                .findByLifeRuleAndUserId(lifeRule, userId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.LIFE_RULE_USER_NOT_FOUND));
        if (lifeRuleUserEntity.isVoted()) {
            throw new BadRequestException(ExceptionCode.LIFE_RULE_USER_ALREADY_VOTED);
        }
        lifeRuleUserEntity.setVoted(true);

        LifeRuleChangeRequestEntity changeRequest = lifeRuleChangeRequestRepository
                .findWithLockByLifeRuleAndStatus(lifeRule, ChangeRequestStatus.PROGRESS)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.LIFE_RULE_CHANGE_REQUEST_NOT_FOUND));

        if (request.isApproved()) {
            changeRequest.approve(changeRequest.getTotalGroupMember());
            if (changeRequest.getStatus() == ChangeRequestStatus.APPROVED) {
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
                                    .orElseThrow(() -> new BadRequestException(ExceptionCode.LIFE_RULE_ITEM_NOT_FOUND));
                            target.update(changeItem.getNewValue(), changeItem.getCategory());
                        }
                        case DELETE -> {
                            LifeRuleItemEntity toDelete = lifeRuleItemRepository.findById(changeItem.getRuleItemId())
                                    .orElseThrow(() -> new BadRequestException(ExceptionCode.LIFE_RULE_ITEM_NOT_FOUND));
                            lifeRule.getItems().remove(toDelete);
                            lifeRuleItemRepository.delete(toDelete);
                        }
                    }
                }
                changeRequest.clear();
                changeRequest.getChangeItems().forEach(LifeRuleChangeItemEntity::clear);
                lifeRuleUserRepository.findByLifeRule(lifeRule)
                        .forEach(lru -> lru.setVoted(false));
            }
        } else {
            changeRequest.clear();
            changeRequest.getChangeItems().forEach(LifeRuleChangeItemEntity::clear);
            lifeRuleUserRepository.findByLifeRule(lifeRule)
                    .forEach(lru -> lru.setVoted(false));
        }
    }

    private LifeRuleEntity findLifeRuleByUserIdOrThrow(Long userId) {
        return lifeRuleRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.LIFE_RULE_NOT_FOUND));
    }

    private List<LifeRuleDto> convertToDtoSet(Set<LifeRuleItemEntity> items) {
        return items.stream()
                .map(item -> {
                    LifeRuleDto dto = new LifeRuleDto();
                    dto.setId(item.getId());
                    dto.setContent(item.getContent());
                    dto.setCategory(item.getCategory());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
