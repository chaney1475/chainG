package com.ssafy.chaing.contract.service.command;

import com.ssafy.chaing.contract.controller.request.UtilityInfoRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UtilityInfoCommand {
    private boolean isEnabled;
    private Long cardId;

    public static UtilityInfoCommand from(UtilityInfoRequest request) {
        return new UtilityInfoCommand(
                request.isEnabled(),
                request.getCardId()
        );
    }
}
