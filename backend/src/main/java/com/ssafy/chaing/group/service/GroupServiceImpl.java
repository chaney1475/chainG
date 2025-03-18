package com.ssafy.chaing.group.service;

import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import com.ssafy.chaing.common.exception.NotFoundException;
import com.ssafy.chaing.common.util.RandomCodeGenerator;
import com.ssafy.chaing.group.domain.GroupEntity;
import com.ssafy.chaing.group.domain.GroupInviteCode;
import com.ssafy.chaing.group.domain.GroupUserEntity;
import com.ssafy.chaing.group.repository.GroupRepository;
import com.ssafy.chaing.group.repository.GroupUserRepository;
import com.ssafy.chaing.group.service.command.CreateGroupCommand;
import com.ssafy.chaing.group.service.command.JoinGroupCommand;
import com.ssafy.chaing.group.service.dto.GroupDTO;
import com.ssafy.chaing.user.domain.UserEntity;
import com.ssafy.chaing.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class GroupServiceImpl implements GroupService {
    private final GroupRepository groupRepository;
    private final GroupUserRepository groupUserRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public GroupDTO createGroup(CreateGroupCommand command) {

        UserEntity owner = userRepository.findById(command.getUserId()).orElseThrow(
                () -> new NotFoundException(ExceptionCode.USER_NOT_FOUND)
        );

        owner.setNickname(command.getOwnerNickname());
        owner.setProfileImage(command.getOwnerProfileImage());

        GroupEntity group = GroupEntity.builder()
                .owner(owner)
                .groupCode(RandomCodeGenerator.generate(6))
                .name(command.getGroupName())
                .maxParticipants(command.getMaxParticipants())
                .isActive(true)
                .build();

        userRepository.save(owner);
        groupRepository.save(group);

        GroupUserEntity groupUser = GroupUserEntity.builder()
                .group(group)
                .user(owner)
                .build();

        groupUserRepository.save(groupUser);

        return GroupDTO.from(group);
    }

    @Override
    @Transactional(readOnly = true)
    public GroupDTO getGroup(Long groupId) {
        GroupEntity group = groupRepository.findById(groupId).orElseThrow(
                () -> new NotFoundException(ExceptionCode.GROUP_NOT_FOUND)
        );
        return GroupDTO.from(group);
    }

    @Override
    @Transactional
    public GroupDTO joinGroup(JoinGroupCommand command) {

        GroupEntity group = groupRepository.findById(command.getGroupId())
                .orElseThrow(() -> new NotFoundException(ExceptionCode.GROUP_NOT_FOUND));

        // 이미 조인한 경우 pass
        if (groupUserRepository.existsByGroupIdAndUserId(group.getId(), command.getUserId())) {
            return GroupDTO.from(group);
        }

        int participantCount = groupUserRepository.countByGroupId(group.getId());
        if (participantCount >= group.getMaxParticipants()) {
            throw new BadRequestException(ExceptionCode.GROUP_FULL);
        }

        // 닉네임 중복 검사
        if (groupUserRepository.existsByGroupIdAndUserNickname(group.getId(), command.getNickname())) {
            throw new BadRequestException(ExceptionCode.DUPLICATE_NICKNAME);
        }

        // 프로필 이미지 중복 검사
        if (groupUserRepository.existsByGroupIdAndUserProfileImage(group.getId(), command.getProfileImage())) {
            throw new BadRequestException(ExceptionCode.DUPLICATE_PROFILE_IMAGE);
        }

        UserEntity user = userRepository.findById(command.getUserId())
                .orElseThrow(() -> new NotFoundException(ExceptionCode.USER_NOT_FOUND));

        user.setNickname(command.getNickname());
        user.setProfileImage(command.getProfileImage());

        GroupUserEntity groupUser = GroupUserEntity.builder()
                .group(group)
                .user(user)
                .build();

        groupUserRepository.save(groupUser);

        return GroupDTO.from(group);
    }

    @Override
    @Transactional(readOnly = true)
    public GroupDTO getGroupByInviteCode(String inviteCode) {
        System.out.println("inviteCode = " + inviteCode);
        GroupInviteCode paredCode = new GroupInviteCode(inviteCode);

        GroupEntity group = groupRepository.findByIdAndGroupCode(paredCode.getGroupId(), paredCode.getGroupCode())
                .orElseThrow(() -> new NotFoundException(ExceptionCode.GROUP_NOT_FOUND));

        return GroupDTO.from(group);
    }

}
