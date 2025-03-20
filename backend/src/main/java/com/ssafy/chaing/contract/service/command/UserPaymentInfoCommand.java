package com.ssafy.chaing.contract.service.command;

import com.ssafy.chaing.contract.controller.request.UserPaymentInfoRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserPaymentInfoCommand {
    private Long userId;
    private int amount;
    private int ratio;

    public static UserPaymentInfoCommand from(UserPaymentInfoRequest request) {
        return new UserPaymentInfoCommand(
                request.getUserId(),
                request.getAmount(),
                request.getRatio()
        );
    }
}
