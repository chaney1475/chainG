package com.ssafy.chaing.contract.service.command;

import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ContractCommand {
    private Long userId;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private RentInfoCommand rent;
    private UtilityInfoCommand utility;
}
