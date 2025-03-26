package com.ssafy.chaing.contract.controller;

import com.ssafy.chaing.auth.domain.UserPrincipal;
import com.ssafy.chaing.common.schema.BaseResponse;
import com.ssafy.chaing.contract.controller.request.CreateLivingBudgetRequest;
import com.ssafy.chaing.contract.controller.response.budget.LivingBudgetAccountResponse;
import com.ssafy.chaing.contract.service.BudgetService;
import com.ssafy.chaing.contract.service.dto.CreateLivingBudgetDto;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "Budget Controller",
        description = "생활비 계좌 관리"
)
@RestController
@RequestMapping("/api/v1/budget/living")
@RequiredArgsConstructor
public class BudgetController {
    private final BudgetService budgetService;

    @GetMapping("/notice/create")
    public ResponseEntity<BaseResponse<Void>> notifyLeaderLivingAccountCreated(
            @AuthenticationPrincipal UserPrincipal principal) {
        budgetService.notifyLeaderToRegisterLivingAccount(principal.getId());
        return ResponseEntity.ok(BaseResponse.success(null));
    }

    @GetMapping("/account")
    public ResponseEntity<BaseResponse<LivingBudgetAccountResponse>> getLivingAccount(
            @AuthenticationPrincipal UserPrincipal principal) {
        LivingBudgetAccountResponse livingAccount = budgetService.getLivingAccount(principal.getId());
        return ResponseEntity.ok(BaseResponse.success(livingAccount));
    }

    @PostMapping("/account")
    public ResponseEntity<BaseResponse<Void>> saveAccountAndNotify(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody CreateLivingBudgetRequest body) {

        CreateLivingBudgetDto dto = new CreateLivingBudgetDto(principal.getId(), body.getAccountNo());
        budgetService.saveAccountAndNotify(dto);
        return ResponseEntity.ok(BaseResponse.success(null));
    }

    @GetMapping("/notice/deposit")
    public ResponseEntity<BaseResponse<Void>> notifyLivingDeposit(
            @AuthenticationPrincipal UserPrincipal principal) {

        return ResponseEntity.ok(BaseResponse.success(null));
    }

    @PostMapping("/notice/withdraw")
    public ResponseEntity<BaseResponse<Void>> notifyLivingWithdraw(
            @AuthenticationPrincipal UserPrincipal principal) {

        return ResponseEntity.ok(BaseResponse.success(null));
    }

}
