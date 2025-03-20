package com.ssafy.chaing.group.controller;

import com.ssafy.chaing.auth.domain.UserPrincipal;
import com.ssafy.chaing.common.schema.BaseResponse;
import com.ssafy.chaing.group.controller.request.CreateGroupRequest;
import com.ssafy.chaing.group.controller.request.JoinGroupRequest;
import com.ssafy.chaing.group.controller.response.GroupResponse;
import com.ssafy.chaing.group.service.GroupService;
import com.ssafy.chaing.group.service.command.CreateGroupCommand;
import com.ssafy.chaing.group.service.command.JoinGroupCommand;
import com.ssafy.chaing.group.service.dto.GroupDTO;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "Group Controller",
        description = "그룹 정보 관리"
)
@Controller
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/groups")
public class GroupController {

    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<BaseResponse<GroupResponse>> createGroup(@RequestBody CreateGroupRequest body,
                                                                   @AuthenticationPrincipal UserPrincipal principal
    ) {
        GroupResponse response = GroupResponse.from(groupService.createGroup(
                new CreateGroupCommand(Long.valueOf(principal.getUsername()),
                        body.getOwnerNickname(),
                        body.getOwnerProfileImage(),
                        body.getGroupName(),
                        body.getMaxParticipants()
                )
        ));

        return ResponseEntity.created(URI.create("/groups/" + response.getId()))
                .body(BaseResponse.success(response));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<BaseResponse<GroupResponse>> getGroup(@PathVariable Long groupId) {
        GroupResponse response = GroupResponse.from(groupService.getGroup(groupId));

        return ResponseEntity.ok()
                .body(BaseResponse.success(response));
    }

    @GetMapping("/search")
    public ResponseEntity<BaseResponse<GroupResponse>> getGroupByInviteCode(
            @Parameter(description = "초대 코드", required = true) @RequestParam(name = "inviteCode") String inviteCode
    ) {
        GroupResponse response = GroupResponse.from(
                groupService.getGroupByInviteCode(inviteCode)
        );

        return ResponseEntity.ok(BaseResponse.success(response));
    }

    @PostMapping("/join")
    public ResponseEntity<BaseResponse<GroupResponse>> joinGroups(@RequestBody JoinGroupRequest body,
                                                                  @AuthenticationPrincipal UserPrincipal principal) {
        GroupDTO groupDTO = groupService.joinGroup(new JoinGroupCommand(Long.valueOf(principal.getUsername()),
                        body.getGroupId(),
                        body.getNickname(),
                        body.getProfileImage()
                )
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success(GroupResponse.from(groupDTO)));


    }

}
