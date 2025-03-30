package com.ssafy.chaing.payment.controller.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DepositTransferRequest {
    private String depositAccountNo;
    private int transactionBalance;
}
