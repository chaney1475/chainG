package com.ssafy.chaing.contract.controller.request;

import com.ssafy.chaing.contract.service.command.UserPaymentInfoCommand;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class UserPaymentInfoRequest {
    private Long userId;
    private int amount;
    private int ratio;

    public UserPaymentInfoCommand toCommand() {
        return new UserPaymentInfoCommand(userId, amount, ratio);
    }
}
