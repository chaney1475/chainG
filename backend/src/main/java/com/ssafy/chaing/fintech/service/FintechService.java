package com.ssafy.chaing.fintech.service;

import com.ssafy.chaing.contract.service.command.CreateCardCommand;
import com.ssafy.chaing.fintech.controller.request.TransferCommand;
import com.ssafy.chaing.fintech.dto.CreateFintechCardRec;
import com.ssafy.chaing.fintech.service.dto.TransferDTO;

public interface FintechService {
    CreateFintechCardRec createFintechCard(CreateCardCommand createCardCommand);

    TransferDTO transfer(TransferCommand command);
}
