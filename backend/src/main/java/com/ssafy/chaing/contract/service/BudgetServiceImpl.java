package com.ssafy.chaing.contract.service;

import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import com.ssafy.chaing.contract.controller.response.budget.LivingBudgetAccountResponse;
import com.ssafy.chaing.contract.domain.ContractUserEntity;
import com.ssafy.chaing.contract.repository.ContractUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final ContractUserRepository contractUserRepository;

    @Override
    public LivingBudgetAccountResponse getLivingAccount(Long userId) {
        ContractUserEntity contractUser = contractUserRepository.findByUser_Id(userId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));
        return LivingBudgetAccountResponse.from(contractUser.getContract().getLiveAccountNo());
    }
}
