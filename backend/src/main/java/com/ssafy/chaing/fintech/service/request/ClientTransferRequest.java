package com.ssafy.chaing.fintech.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.chaing.fintech.controller.request.TransferCommand;
import com.ssafy.chaing.fintech.service.common.HeaderWithUserKeyDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ClientTransferRequest {

    @JsonProperty("Header")
    private HeaderWithUserKeyDTO header;

    @JsonProperty("depositAccountNo")
    private String depositAccountNo;

    @JsonProperty("depositTransactionSummary")
    private String depositTransactionSummary;

    @JsonProperty("transactionBalance")
    private String transactionBalance;

    @JsonProperty("withdrawalAccountNo")
    private String withdrawalAccountNo;

    @JsonProperty("withdrawalTransactionSummary")
    private String withdrawalTransactionSummary;

    public ClientTransferRequest(HeaderWithUserKeyDTO header, TransferCommand body) {
        this.header = header;
        this.depositAccountNo = body.getToAccountNo();
        this.depositTransactionSummary = "(수시입출금) : 입금(이체)";
        this.transactionBalance = String.valueOf(body.getAmount()); // 테스트 값 설정
        this.withdrawalAccountNo = body.getFromAccountNo();
        this.withdrawalTransactionSummary = "(수시입출금) : 출금(이체)";
    }
}
