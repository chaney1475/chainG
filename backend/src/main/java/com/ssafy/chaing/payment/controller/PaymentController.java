package com.ssafy.chaing.payment.controller;

import com.ssafy.chaing.auth.domain.UserPrincipal;
import com.ssafy.chaing.common.schema.BaseResponse;
import com.ssafy.chaing.payment.controller.request.RetrieveRentRequest;
import com.ssafy.chaing.payment.controller.request.RetrieveUtilityRequest;
import com.ssafy.chaing.payment.controller.response.RetrieveRentResponse;
import com.ssafy.chaing.payment.controller.response.RetrieveUtilityResponse;
import com.ssafy.chaing.payment.service.PaymentService;
import com.ssafy.chaing.payment.service.command.RetrieveRentCommand;
import com.ssafy.chaing.payment.service.command.RetrieveUtilityCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/rent")
    public ResponseEntity<?> retrieveRent(
            @RequestBody RetrieveRentRequest body,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        try {
            RetrieveRentCommand command = body.toCommand(principal);
            RetrieveRentResponse response = RetrieveRentResponse.from(paymentService.retrieveRent(command));
            return ResponseEntity.ok(BaseResponse.success(response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(BaseResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/utility")
    public ResponseEntity<?> retrieveUtility(
            @RequestBody RetrieveUtilityRequest body,
            @AuthenticationPrincipal UserPrincipal principal
            ) {
        try{
            RetrieveUtilityCommand command = body.toCommand(principal);
            RetrieveUtilityResponse response = RetrieveUtilityResponse.from(paymentService.retrieveUtility(command));
            return ResponseEntity.ok(BaseResponse.success(response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(BaseResponse.error(e.getMessage()));
        }
    }
}
