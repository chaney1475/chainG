package com.ssafy.chaing.auth.controller.response;

import com.ssafy.chaing.auth.service.dto.UserInfoDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserInfoResponse {
    private Long id;
    private String name;
    private String nickname;

    public static UserInfoResponse from(UserInfoDTO dto) {
        return new UserInfoResponse(dto.getId(), dto.getName(), dto.getNickname());
    }
}
