package com.ssafy.chaing.blockchain.handler.contract.input;

import java.math.BigInteger;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class PaymentInfoInput {
    private BigInteger userId;
    private BigInteger amount;
    private BigInteger ratio;
}