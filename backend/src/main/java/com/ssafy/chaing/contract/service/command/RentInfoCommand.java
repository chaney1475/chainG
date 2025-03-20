package com.ssafy.chaing.contract.service.command;

import com.ssafy.chaing.contract.controller.request.RentInfoRequest;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
public class RentInfoCommand {
    private int totalAmount;
    private int dueDate;
    private String rentAccountNo;
    private String ownerAccountNo;
    private int totalRatio;
    private List<UserPaymentInfoCommand> userPaymentInfo;

    public static RentInfoCommand from(RentInfoRequest request) {
        return new RentInfoCommand(
                request.getTotalAmount(),
                request.getDueDate(),
                request.getRentAccountNo(),
                request.getRentAccountNo(),
                request.getTotalRatio(),
                request.getUserPaymentInfo().stream().map(UserPaymentInfoCommand::from).toList()
        );
    }
}
