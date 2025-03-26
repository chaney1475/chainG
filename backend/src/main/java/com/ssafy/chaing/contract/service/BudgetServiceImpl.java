package com.ssafy.chaing.contract.service;

import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import com.ssafy.chaing.contract.controller.response.budget.LivingBudgetAccountResponse;
import com.ssafy.chaing.contract.domain.ContractUserEntity;
import com.ssafy.chaing.contract.repository.ContractUserRepository;
import com.ssafy.chaing.contract.service.dto.CreateLivingBudgetDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final ContractUserRepository contractUserRepository;
    //TODO : FCM 으로 알림 보내기.

    @Override
    public void notifyLeaderToRegisterLivingAccount(Long userId) {
        ContractUserEntity contractUser = contractUserRepository.findByUser_Id(userId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));
        // 생활비 계좌 조회
        if (contractUser.getContract().getLiveAccountNo() == null) {
            // TODO 1. 방장을 찾는다 2. 방장에게 알림 쏜다(FCM)
            System.err.println("이거 안했다 해야된다 얘들아.");
        } else {
            throw new BadRequestException(ExceptionCode.LIVING_ACCOUNT_ALREADY_EXIST);
        }
    }

    @Override
    public LivingBudgetAccountResponse getLivingAccount(Long userId) {
        ContractUserEntity contractUser = contractUserRepository.findByUser_Id(userId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));
        return LivingBudgetAccountResponse.from(contractUser.getContract().getLiveAccountNo());
    }

    @Override
    @Transactional
    public void saveAccountAndNotify(CreateLivingBudgetDto accountInfo) {
        ContractUserEntity contractUser = contractUserRepository.findByUser_Id(accountInfo.getId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));
        contractUser.getContract().setLiveAccountNo(accountInfo.getAccountNo());
        // TODO 모두에게 알림 쏜다(FCM)
        System.err.println("이거 안했다 해야된다 얘들아.");
    }


    @Override
    public void notifyLivingDeposit(Long userId) {
        // TODO 모두에게 알림 쏜다(FCM)
        System.err.println("이거 안했다 해야된다 얘들아.");
    }

    @Override
    public void notifyLivingWithdraw(Long userId) {
        // TODO 모두에게 알림 쏜다(FCM)
        System.err.println("이거 안했다 해야된다 얘들아.");
    }
}
