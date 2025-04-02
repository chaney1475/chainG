package com.ssafy.chaing.fintech.service;

import com.ssafy.chaing.contract.service.command.CreateCardCommand;
import com.ssafy.chaing.fintech.controller.request.InquireBillingCommand;
import com.ssafy.chaing.fintech.controller.request.TransferCommand;
import com.ssafy.chaing.fintech.controller.response.FintechResponse;
import com.ssafy.chaing.fintech.dto.CreateFintechCardRec;
import com.ssafy.chaing.fintech.dto.InquireBillingStatementsRec;
import com.ssafy.chaing.fintech.service.dto.TransferDTO;
import java.util.List;

public interface FintechService {
    CreateFintechCardRec createFintechCard(CreateCardCommand createCardCommand);

    TransferDTO transfer(TransferCommand command);

    List<InquireBillingStatementsRec> inquireBillingStatements(InquireBillingCommand command);

    FintechResponse<?> inquireDemandDepositAccount(String accountNo);

    FintechResponse<?> createAccount();
}
