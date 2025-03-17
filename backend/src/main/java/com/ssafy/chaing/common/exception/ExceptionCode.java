package com.ssafy.chaing.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum ExceptionCode {

    USER_NOT_FOUND("USER_NOT_FOUND", "유저가 존재하지 않습니다."),
    DUPLICATE_EMAIL("DUPLICATE_EMAIL", "이미 존재하는 이메일입니다."),

    DUPLICATE_NICKNAME("DUPLICATE_NICKNAME", "그룹 내에 이미 존재하는 닉네임입니다."),
    DUPLICATE_PROFILE_IMAGE("DUPLICATE_PROFILE_IMAGE", "그룹 내에 이미 존재하는 프로필 이미지입니다."),
    GROUP_FULL("GROUP_FULL", "그룹의 인원이 가득 찼습니다."),
    GROUP_NOT_FOUND("GROUP_NOT_FOUND", "그룹이 존재하지 않습니다."),

    INVALID_PASSWORD("INVALID_PASSWORD", "비밀번호가 틀렸습니다."),
    INVALID_TOKEN("EXPIRED_ACCESS_TOKEN", "로그인에 실패하였습니다."),
    SOCIAL_NOT_FOUND("SOCIAL_NOT_FOUND", "지원하지 않는 로그인 방식입니다."),

    ;

    private final String code;
    private final String message;
}


