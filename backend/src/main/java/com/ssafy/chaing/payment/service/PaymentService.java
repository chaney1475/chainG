package com.ssafy.chaing.payment.service;

import com.ssafy.chaing.payment.service.command.RetrieveRentCommand;
import com.ssafy.chaing.payment.service.command.RetrieveUtilityCommand;
import com.ssafy.chaing.payment.service.dto.RetrieveRentDTO;
import com.ssafy.chaing.payment.service.dto.RetrieveUtilityDTO;

public interface PaymentService {
    RetrieveRentDTO retrieveRent(RetrieveRentCommand command);
    RetrieveUtilityDTO retrieveUtility(RetrieveUtilityCommand command);
}
