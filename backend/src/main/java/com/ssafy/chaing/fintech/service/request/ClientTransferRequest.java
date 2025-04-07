package com.ssafy.chaing.fintech.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.chaing.fintech.controller.request.TransferCommand;
import com.ssafy.chaing.fintech.service.common.HeaderWithUserKeyDTO;
import com.ssafy.chaing.payment.domain.FeeType;
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
        FeeType type = body.getFeeType();

        String depositTransactionSummary = "(수시입출금) : 입금(이체)";
        String withdrawalTransactionSummary = "(수시입출금) : 출금(이체)";

        String feeTypeMemo = null;
        if (type.equals(FeeType.UTILITY)) {
            feeTypeMemo = "공과금 ";
        } else if (type.equals(FeeType.RENT)) {
            feeTypeMemo = "월세 ";
        }

        if (feeTypeMemo != null) {
            depositTransactionSummary = feeTypeMemo + depositTransactionSummary;
            withdrawalTransactionSummary = feeTypeMemo + withdrawalTransactionSummary;
        }
        this.header = header;
        this.depositAccountNo = body.getToAccountNo();
        this.depositTransactionSummary = depositTransactionSummary;
        this.transactionBalance = String.valueOf(body.getAmount());
        this.withdrawalAccountNo = body.getFromAccountNo();
        this.withdrawalTransactionSummary = withdrawalTransactionSummary;

    }
}
