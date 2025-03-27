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
    GROUP_INVITE_CODE_INVALID("GROUP_INVITE_CODE_INVALID", "유효하지 않은 그룹 초대 코드입니다."),


    CONTRACT_ALREADY_CONFIRMED("CONTRACT_ALREADY_CONFIRMED", "수정이 불가능합니다. 계약서가 이미 확정 되었습니다."),
    CONTRACT_ALREADY_EXIST("CONTRACT_ALREADY_EXIST", "이미 계약서가 존재합니다."),
    CONTRACT_NOT_FOUND("CONTRACT_NOT_FOUND", "계약서가 존재하지 않습니다."),
    CARD_NOT_FOUND("CARD_NOT_FOUND", "카드가 존재하지 않습니다."),
    CONTRACT_USER_NOT_FOUND("CONTRACT_USER_NOT_FOUND", "사용자의 계약 정보가 존재하지 않습니다."),

    INVALID_PASSWORD("INVALID_PASSWORD", "비밀번호가 틀렸습니다."),
    INVALID_TOKEN("EXPIRED_ACCESS_TOKEN", "로그인에 실패하였습니다."),
    SOCIAL_NOT_FOUND("SOCIAL_NOT_FOUND", "지원하지 않는 로그인 방식입니다."),

    INVALID_DUEDATE("INVALID_DUEDATE", "유효하지 않은 납부일입니다. 납부일은 2일 이상 28일 이하여야 합니다."),

    DUTY_NOT_FOUND("DUTY_NOT_FOUND", "당번이 존재하지 않습니다."),
    USER_NOT_IN_GROUP("USER_NOT_IN_GROUP", "해당 유저가 그룹에 속해 있지 않습니다."),

    USER_PAYMENT_NOT_FOUND("USER_PAYMENT_NOT_FOUND", "결제 정보에 해당하는 사용자가 없습니다."),
    LIVING_ACCOUNT_ALREADY_EXIST("LIVING_ACCOUNT_ALREADY_EXIST", "이미 계좌가 존재합니다."),
    RENT_ACCOUNT_ALREADY_EXIST("RENT_ACCOUNT_ALREADY_EXIST", "공과금/월세 계좌번호가 존재하지 않습니다."),

    INVALID_YEAR("INVALID_YEAR", "입력된 '년도'가 범위를 초과하였습니다."),
    INVALID_MONTH("INVALID_MONTH", "입력된 '월'이 범위를 초과하였습니다."),

    FINTECH_TRANSFER_FAILED("FINTECH_TRANSFER_FAILED", "핀테크 송금에 실패하였습니다.");
    private final String code;
    private final String message;
}


