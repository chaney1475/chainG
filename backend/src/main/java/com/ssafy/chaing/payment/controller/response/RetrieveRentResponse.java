package com.ssafy.chaing.payment.controller.response;

import com.ssafy.chaing.payment.service.dto.CurrentPaymentDTO;
import com.ssafy.chaing.payment.service.dto.MonthPaymentIDTO;
import com.ssafy.chaing.payment.service.dto.RetrieveRentDTO;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class RetrieveRentResponse {
    private Integer totalAmount;
    private Integer myAmount;
    private Integer dueDate;
    private List<CurrentPaymentDTO> currentMonth;
    private List<MonthPaymentIDTO> monthList;

    public RetrieveRentResponse from(RetrieveRentDTO dto) {
        return new RetrieveRentResponse(
                dto.getTotalAmount(),
                dto.getMyAmount(),
                dto.getDueDate(),
                dto.getCurrentMonth(),
                dto.getMonthList()
        );
    }
}
