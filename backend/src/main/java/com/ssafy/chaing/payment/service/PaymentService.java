package com.ssafy.chaing.payment.service;

import com.ssafy.chaing.payment.controller.request.DepositTransferRequest;
import com.ssafy.chaing.payment.controller.response.AccountInfoResponse;
import com.ssafy.chaing.payment.service.command.RetrieveRentCommand;
import com.ssafy.chaing.payment.service.command.RetrieveUtilityCommand;
import com.ssafy.chaing.payment.service.dto.RetrieveRentDTO;
import com.ssafy.chaing.payment.service.dto.TransferDto;
import com.ssafy.chaing.payment.service.dto.RetrieveUtilityDTO;

public interface PaymentService {

    RetrieveRentDTO retrieveRent(RetrieveRentCommand command);

    AccountInfoResponse getRentAccountNo(Long userId);

    void transferToOwner(TransferDto transferInfo);

    void depositToLifeAccount(TransferDto transferDto);
    RetrieveUtilityDTO retrieveUtility(RetrieveUtilityCommand command);
}
