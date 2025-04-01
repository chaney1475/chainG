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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(
        name = "Payment API",
        description = "송금 내역 관리 API"
)
@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(
            summary = "계약 ID로 송금 내역 조회",
            description = "해당 계약의 전체 송금 내역을 조회합니다."
    )
    @GetMapping("/rent")
    public ResponseEntity<?> retrieveRent(
            @Valid @RequestParam RetrieveRentRequest month,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        RetrieveRentCommand command = month.toCommand(principal);
        RetrieveRentResponse response = RetrieveRentResponse.from(paymentService.retrieveRent(command));
        return ResponseEntity.ok(BaseResponse.success(response));
    }

    @Operation(
            summary = "생활비 송금 내역 조회",
            description = "생활비 항목의 송금 내역을 조회합니다. 로그인한 사용자 기준으로 월별 검색합니다."
    )
    @GetMapping("/utility")
    public ResponseEntity<?> retrieveUtility(
            @Valid @RequestBody RetrieveUtilityRequest body,
            @AuthenticationPrincipal UserPrincipal principal
            ) {
        RetrieveUtilityCommand command = body.toCommand(principal);
        RetrieveUtilityResponse response = RetrieveUtilityResponse.from(paymentService.retrieveUtility(command));
        return ResponseEntity.ok(BaseResponse.success(response));
    }

    @Operation(
            summary = "공과금 계좌 정보 조회",
            description = "공과금/월세용 계좌 정보를 조회합니다."
    )
    @GetMapping("/account")
    public ResponseEntity<BaseResponse<AccountInfoResponse>> getRentAccountNo(
            @AuthenticationPrincipal UserPrincipal principal) {
        AccountInfoResponse response = paymentService.getRentAccountNo(principal.getId());
        return ResponseEntity.ok(BaseResponse.success(response));
    }

    @Operation(
            summary = "사용자 → 그룹장 송금",
            description = "사용자 개인 계좌에서 그룹장 계좌로 송금합니다."
    )
    @PostMapping("/withdraw")
    public ResponseEntity<BaseResponse<Void>> transferToOwner(
            @Valid @RequestBody DepositTransferRequest body,
            @AuthenticationPrincipal UserPrincipal principal) {
        TransferRentCommand transferCommand = TransferRentCommand.fromDepositRequest(body, principal.getId());
        paymentService.transferToOwner(transferCommand);
        return ResponseEntity.ok(BaseResponse.success(null));
    }

    @Operation(
            summary = "그룹장 → 생활비 계좌 입금",
            description = "그룹장이 개인 계좌에서 공동 생활비 계좌로 입금합니다."
    )
    @PostMapping("/deposit")
    public ResponseEntity<BaseResponse<Void>> depositToLifeAccount(
            @Valid @RequestBody WithdrawTransferRequest body,
            @AuthenticationPrincipal UserPrincipal principal) {
        TransferRentCommand transferCommand = TransferRentCommand.fromWithdrawRequest(body, principal.getId());
        paymentService.depositToLifeAccount(transferCommand);
        return ResponseEntity.ok(BaseResponse.success(null));
    }

}
