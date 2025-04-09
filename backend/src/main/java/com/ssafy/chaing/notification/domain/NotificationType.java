package com.ssafy.chaing.notification.domain;

import lombok.Getter;

@Getter
public enum NotificationType {

    LIFE_RULE_CREATED("새로운 생활 규칙이 생성되었어요!", "함께 정한 규칙을 확인해보세요."),
    LIFE_RULE_APPROVED("생활 규칙이 확정되었어요!", "확정된 새로운 규칙을 확인해보세요."),
    LIFE_RULE_UPDATE_REQUESTED("생활 규칙에 수정 요청이 있어요!", "함께 정한 규칙을 검토하고 승인해주세요."),
    LIFE_RULE_REJECTED("생활 규칙 수정이 거절되었어요!", "다시 내용을 확인해보고 재요청할 수 있어요.");


    private final String title;
    private final String content;

    NotificationType(String title, String content) {
        this.title = title;
        this.content = content;
    }

}
