package com.ssafy.chaing.group.service;

import com.ssafy.chaing.group.service.command.CreateGroupCommand;
import com.ssafy.chaing.group.service.command.JoinGroupCommand;
import com.ssafy.chaing.group.service.dto.GroupDTO;

public interface GroupService {
    GroupDTO createGroup(CreateGroupCommand command);

    GroupDTO getGroup(Long groupId);

    GroupDTO joinGroup(JoinGroupCommand command);

    GroupDTO getGroupByInviteCode(String inviteCode);
}
