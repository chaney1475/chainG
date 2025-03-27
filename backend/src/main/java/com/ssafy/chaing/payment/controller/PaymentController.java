package com.ssafy.chaing.payment.controller;

import com.ssafy.chaing.auth.domain.UserPrincipal;
import com.ssafy.chaing.common.schema.BaseResponse;
import com.ssafy.chaing.contract.controller.response.ContractDetailResponse;
import com.ssafy.chaing.fintech.service.FintechService;
import com.ssafy.chaing.payment.controller.request.DepositTransferRequest;
import com.ssafy.chaing.common.schema.BaseResponse;
import com.ssafy.chaing.payment.controller.request.RetrieveRentRequest;
import com.ssafy.chaing.payment.controller.request.RetrieveUtilityRequest;
import com.ssafy.chaing.payment.controller.response.RetrieveRentResponse;
import com.ssafy.chaing.payment.controller.response.RetrieveUtilityResponse;
import com.ssafy.chaing.payment.controller.request.WithdrawTransferRequest;
import com.ssafy.chaing.payment.controller.response.AccountInfoResponse;
import com.ssafy.chaing.payment.service.PaymentService;
import com.ssafy.chaing.payment.service.command.RetrieveRentCommand;
import com.ssafy.chaing.payment.service.command.RetrieveUtilityCommand;
import com.ssafy.chaing.payment.service.dto.TransferDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
        RetrieveRentResponse response = RetrieveRentResponse.from(paymentService.retrieveRent(command));
        return ResponseEntity.ok(BaseResponse.success(response));
    }

    @GetMapping("/utility")
    public ResponseEntity<?> retrieveUtility(
            @RequestBody RetrieveUtilityRequest body,
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
            @RequestBody DepositTransferRequest body,
            @AuthenticationPrincipal UserPrincipal principal) {
        TransferDto transferDto = TransferDto.fromDepositRequest(body, principal.getId());
        paymentService.transferToOwner(transferDto);
        return ResponseEntity.ok(BaseResponse.success(null));
    }

    @PostMapping("/deposit")
    public ResponseEntity<BaseResponse<Void>> depositToLifeAccount(
            @RequestBody WithdrawTransferRequest body,
            @AuthenticationPrincipal UserPrincipal principal) {
        TransferDto transferDto = TransferDto.fromWithdrawRequest(body, principal.getId());
        paymentService.depositToLifeAccount(transferDto);
        return ResponseEntity.ok(BaseResponse.success(null));
    }

}
