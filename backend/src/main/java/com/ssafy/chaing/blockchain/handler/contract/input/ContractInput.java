package com.ssafy.chaing.blockchain.handler.contract.input;

import java.math.BigInteger;
import java.util.List;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
public class ContractInput {
    private BigInteger id; // 실제 ContractEntity ID
    private String startDate;
    private String endDate;
    private BigInteger rentTotalAmount;
    private BigInteger rentDueDate;
    private String rentAccountNo;
    private String ownerAccountNo;
    private BigInteger rentTotalRatio;
    private List<PaymentInfoInput> paymentInfos;
    private String liveAccountNo;
    private Boolean isUtilityEnabled;
    private BigInteger utilitySplitRatio;
    private BigInteger cardId;
}