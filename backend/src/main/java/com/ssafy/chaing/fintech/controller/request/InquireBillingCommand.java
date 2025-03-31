package com.ssafy.chaing.fintech.controller.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class InquireBillingCommand {
    private String cardNo;
    private String cvc;
    private String startMonth;
    private String endMonth;

    public InquireBillingCommand(String cardNo, String cvc) {
        this.cardNo = cardNo;
        this.cvc = cvc;
        setBillingPeriod();
    }

    public void setBillingPeriod() {
        java.time.LocalDate today = java.time.LocalDate.now();
        this.endMonth = String.valueOf(today.getMonthValue());
        this.startMonth = String.valueOf(today.minusMonths(1).getMonthValue());
    }
    
}
