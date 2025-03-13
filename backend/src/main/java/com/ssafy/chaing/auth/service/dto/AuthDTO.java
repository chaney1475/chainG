package com.ssafy.chaing.auth.service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AuthDTO {
    private String accessToken;
    private UserInfoDTO userInfo;
}
