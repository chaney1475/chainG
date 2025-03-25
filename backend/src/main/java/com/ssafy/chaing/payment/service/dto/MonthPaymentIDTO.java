package com.ssafy.chaing.payment.service.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MonthPaymentIDTO {
    private String month;
    private List<Long> paidUserIds;
    private List<Long> debtUserIds;

}
