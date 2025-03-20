package com.ssafy.chaing.contract.controller.request;

import com.ssafy.chaing.contract.service.command.ContractCommand;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class UpdateDraftContractRequest {
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private RentInfoRequest rent;
    private UtilityInfoRequest utility;

    public ContractCommand toCommand(Long userId) {
        return new ContractCommand(
                userId,
                startDate,
                endDate,
                rent.toCommand(),
                utility.toCommand()
        );
    }
}
