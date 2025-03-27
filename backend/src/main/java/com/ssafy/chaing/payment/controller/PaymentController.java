package com.ssafy.chaing.payment.controller;

import com.ssafy.chaing.auth.domain.UserPrincipal;
import com.ssafy.chaing.payment.controller.request.RetrieveRentRequest;
import com.ssafy.chaing.payment.service.PaymentService;
import com.ssafy.chaing.payment.service.command.RetrieveRentCommand;
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
        RetrieveRentCommand command = body.toCommand(principal);

        return ResponseEntity.ok().build();
    }
}
