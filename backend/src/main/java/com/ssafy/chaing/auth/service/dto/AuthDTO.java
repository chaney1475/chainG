package com.ssafy.chaing.auth.service.dto;

import com.ssafy.chaing.user.service.dto.UserInfoDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AuthDTO {
    private String accessToken;
    private UserInfoDTO userInfo;
}
