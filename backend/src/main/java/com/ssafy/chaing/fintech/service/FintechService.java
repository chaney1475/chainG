package com.ssafy.chaing.fintech.service;

import com.ssafy.chaing.contract.service.command.CreateCardCommand;
import com.ssafy.chaing.fintech.dto.CreateFintechCardRec;

public interface FintechService {
    CreateFintechCardRec createFintechCard(CreateCardCommand createCardCommand);
}
