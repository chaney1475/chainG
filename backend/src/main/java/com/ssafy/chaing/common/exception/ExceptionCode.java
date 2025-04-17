package com.ssafy.chaing.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum ExceptionCode {

    USER_NOT_FOUND("USER_NOT_FOUND", "유저가 존재하지 않습니다."),
    DUPLICATE_EMAIL("DUPLICATE_EMAIL", "이미 존재하는 이메일입니다."),

    INVALID_PASSWORD("INVALID_PASSWORD", "비밀번호가 틀렸습니다."),
    INVALID_TOKEN("EXPIRED_ACCESS_TOKEN", "로그인에 실패하였습니다."),
    SOCIAL_NOT_FOUND("SOCIAL_NOT_FOUND", "지원하지 않는 로그인 방식입니다."),

    ;

    private final String code;
    private final String message;
}


