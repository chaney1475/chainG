package com.ssafy.chaing.contract.controller.request;

import jakarta.validation.constraints.NotNull;
import java.time.ZonedDateTime;

public class ContractFinalizeRequest {
    @NotNull
    private Long id;

    @NotNull
    private Long groupId;

    @NotNull
    private ZonedDateTime startDate;

    @NotNull
    private ZonedDateTime endDate;

    @NotNull
    private RentInfoRequest rent;

    @NotNull
    private UtilityInfoRequest utility;
}
