package com.ssafy.chaing.contract.service;

import com.ssafy.chaing.contract.controller.response.budget.LivingBudgetAccountResponse;
import com.ssafy.chaing.contract.service.dto.CreateLivingBudgetDto;

public interface BudgetService {

    void notifyLeaderToRegisterLivingAccount(Long userId);

    LivingBudgetAccountResponse getLivingAccount(Long userId);

    void saveAccountAndNotify(CreateLivingBudgetDto accountInfo);

    void notifyLivingDeposit(Long userId);

    void notifyLivingWithdraw(Long userId);

}
