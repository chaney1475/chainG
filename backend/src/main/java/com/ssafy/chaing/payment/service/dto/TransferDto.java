package com.ssafy.chaing.payment.service.dto;

import com.ssafy.chaing.contract.service.dto.ContractDTO;
import com.ssafy.chaing.payment.controller.request.DepositTransferRequest;
import com.ssafy.chaing.payment.controller.request.WithdrawTransferRequest;
import java.time.ZoneId;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TransferDto {
    private Long userId;
    private String accountNo;
    private int balance;


    public static TransferDto fromDepositRequest(DepositTransferRequest request, Long userId){
        return new TransferDto(
                userId,
                request.getDepositAccountNo(),
                request.getTransactionBalance()
        );
    }
    public static TransferDto fromWithdrawRequest(WithdrawTransferRequest request, Long userId){
        return new TransferDto(
                userId,
                request.getWithdrawalAccountNo(),
                request.getTransactionBalance()
        );
    }
}
