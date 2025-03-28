package com.ssafy.chaing.common.exception;

import lombok.Getter;

@Getter
public class FileStorageException extends RuntimeException {
    private final String code;

    public FileStorageException(ExceptionCode exceptionCode) {
        super(exceptionCode.getMessage());
        this.code = exceptionCode.getCode();
    }
}