package com.ssafy.chaing.fintech.service.common;

public record HeaderDTO(
        String apiName,
        String transmissionDate,
        String transmissionTime,
        String institutionCode,
        String fintechAppNo,
        String apiServiceCode,
        String institutionTransactionUniqueNo,
        String apiKey,
        String userKey
) {}
