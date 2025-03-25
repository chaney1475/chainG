package com.ssafy.chaing.fintech.controller.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TransferCommand {
    private String fromAccountNo;
    private String toAccountNo;
    private int amount;
}
