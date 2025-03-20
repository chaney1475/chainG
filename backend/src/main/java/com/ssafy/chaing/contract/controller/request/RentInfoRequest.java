package com.ssafy.chaing.contract.controller.request;

import com.ssafy.chaing.contract.service.command.RentInfoCommand;
import java.util.List;
import lombok.Getter;

@Getter
public class RentInfoRequest {
    private int totalAmount;
    private int dueDate;
    private String rentAccountNo;
    private String ownerAccountNo;
    private int totalRatio;
    private List<UserPaymentInfoRequest> userPaymentInfo;

    public RentInfoCommand toCommand() {
        return new RentInfoCommand(
                totalAmount,
                dueDate,
                rentAccountNo,
                ownerAccountNo,
                totalRatio,
                userPaymentInfo
                        .stream()
                        .map(UserPaymentInfoRequest::toCommand)
                        .toList()
        );
    }
}
