package com.ssafy.chaing.contract.service;

import com.ssafy.chaing.contract.controller.response.budget.LivingBudgetAccountResponse;

public interface BudgetService {

    LivingBudgetAccountResponse getLivingAccount(Long userId);
}
