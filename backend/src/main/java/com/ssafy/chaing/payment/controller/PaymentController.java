package com.ssafy.chaing.payment.controller;

import com.ssafy.chaing.auth.domain.UserPrincipal;
import com.ssafy.chaing.common.schema.BaseResponse;
import com.ssafy.chaing.payment.controller.request.DepositTransferRequest;
import com.ssafy.chaing.payment.controller.request.RetrieveRentRequest;
import com.ssafy.chaing.payment.controller.request.RetrieveUtilityRequest;
import com.ssafy.chaing.payment.controller.request.WithdrawTransferRequest;
import com.ssafy.chaing.payment.controller.response.AccountInfoResponse;
import com.ssafy.chaing.payment.controller.response.RetrieveRentResponse;
import com.ssafy.chaing.payment.controller.response.RetrieveUtilityResponse;
import com.ssafy.chaing.payment.service.PaymentService;
import com.ssafy.chaing.payment.service.command.RetrieveRentCommand;
import com.ssafy.chaing.payment.service.command.RetrieveUtilityCommand;
import com.ssafy.chaing.payment.service.command.TransferRentCommand;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/rent")
    public ResponseEntity<?> retrieveRent(
            @Valid @RequestParam("month") RetrieveRentRequest body,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        RetrieveRentCommand command = body.toCommand(principal);
        RetrieveRentResponse response = RetrieveRentResponse.from(paymentService.retrieveRent(command));
        return ResponseEntity.ok(BaseResponse.success(response));
    }

    @GetMapping("/utility")
    public ResponseEntity<?> retrieveUtility(
            @Valid @RequestParam("month") RetrieveUtilityRequest body,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        RetrieveUtilityCommand command = body.toCommand(principal);
        RetrieveUtilityResponse response = RetrieveUtilityResponse.from(paymentService.retrieveUtility(command));
        return ResponseEntity.ok(BaseResponse.success(response));
    }

    @GetMapping("/account")
    public ResponseEntity<BaseResponse<AccountInfoResponse>> getRentAccountNo(
            @AuthenticationPrincipal UserPrincipal principal) {
        AccountInfoResponse response = paymentService.getRentAccountNo(principal.getId());
        return ResponseEntity.ok(BaseResponse.success(response));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<BaseResponse<Void>> transferToOwner(
            @Valid @RequestBody DepositTransferRequest body,
            @AuthenticationPrincipal UserPrincipal principal) {
        TransferRentCommand transferCommand = TransferRentCommand.fromDepositRequest(body, principal.getId());
        paymentService.transferToOwner(transferCommand);
        return ResponseEntity.ok(BaseResponse.success(null));
    }

    @PostMapping("/deposit")
    public ResponseEntity<BaseResponse<Void>> depositToLifeAccount(
            @Valid @RequestBody WithdrawTransferRequest body,
            @AuthenticationPrincipal UserPrincipal principal) {
        TransferRentCommand transferCommand = TransferRentCommand.fromWithdrawRequest(body, principal.getId());
        paymentService.depositToLifeAccount(transferCommand);
        return ResponseEntity.ok(BaseResponse.success(null));
    }

}
