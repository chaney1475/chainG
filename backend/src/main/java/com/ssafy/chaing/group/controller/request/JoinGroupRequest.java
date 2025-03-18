package com.ssafy.chaing.group.controller.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class JoinGroupRequest {
    private Long groupId;
    private String nickname;
    private String profileImage;
}
