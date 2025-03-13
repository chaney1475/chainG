package com.ssafy.chaing.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum ExceptionCode {

    USER_NOT_FOUND("USER_NOT_FOUND", "유저가 존재하지 않습니다.");

    private final String code;
    private final String message;
}


