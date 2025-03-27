package com.ssafy.chaing.payment.service.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class RetrieveUtilityDTO {
    private Integer totalAmount;
    private Integer myAmount;
    private String dueDayOfWeek;
    private List<CurrentPaymentDTO> currentMonth;
    private List<WeekPaymentDTO> weekList;
}
