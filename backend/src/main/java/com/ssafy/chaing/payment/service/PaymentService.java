package com.ssafy.chaing.payment.service;

import com.ssafy.chaing.payment.service.command.RetrieveRentCommand;
import com.ssafy.chaing.payment.service.dto.RetrieveRentDTO;

public interface PaymentService {
    RetrieveRentDTO retrieveRent(RetrieveRentCommand command);
}
