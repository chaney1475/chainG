package com.ssafy.chaing.contract.controller.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransferRequest {
    private String withdrawalAccountNo;
    private Long transactionBalance;
}
