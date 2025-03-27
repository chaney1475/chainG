package com.ssafy.chaing.contract.controller.response.budget;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LivingBudgetAccountResponse {
    private String accountNo;

    public static LivingBudgetAccountResponse from(String liveAccountNo) {
        LivingBudgetAccountResponse response = new LivingBudgetAccountResponse();
        response.accountNo = liveAccountNo;
        return response;
    }
}
