package com.ssafy.chaing.contract.service.command;

import com.ssafy.chaing.fintech.service.request.CreateFintechCardRequest;

public record CreateCardCommand(
        String accountNo
) {}
