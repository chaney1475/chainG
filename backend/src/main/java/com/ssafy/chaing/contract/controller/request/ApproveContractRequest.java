package com.ssafy.chaing.contract.controller.request;

import com.ssafy.chaing.contract.service.command.ApproveContractCommand;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
public class ApproveContractRequest {
    private String accountNo;

    public ApproveContractCommand toCommand(Long userId) {
        return new ApproveContractCommand(
                userId,
                accountNo
        );
    }
}
