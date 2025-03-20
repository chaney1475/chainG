package com.ssafy.chaing.contract.controller.request;

import com.ssafy.chaing.contract.service.command.UtilityInfoCommand;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UtilityInfoRequest {
    private boolean isEnabled;
    private Long cardId;

    public UtilityInfoCommand toCommand() {
        return new UtilityInfoCommand(
                isEnabled,
                cardId
        );
    }
}
