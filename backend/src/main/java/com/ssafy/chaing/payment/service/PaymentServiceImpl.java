package com.ssafy.chaing.payment.service;

import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import com.ssafy.chaing.contract.domain.ContractEntity;
import com.ssafy.chaing.contract.domain.ContractUserEntity;
import com.ssafy.chaing.contract.repository.ContractRepository;
import com.ssafy.chaing.contract.repository.ContractUserRepository;
import com.ssafy.chaing.group.domain.GroupEntity;
import com.ssafy.chaing.group.repository.GroupRepository;
import com.ssafy.chaing.payment.domain.FeeType;
import com.ssafy.chaing.payment.domain.PaymentEntity;
import com.ssafy.chaing.payment.repository.PaymentRepository;
import com.ssafy.chaing.payment.service.command.RetrieveRentCommand;
import com.ssafy.chaing.payment.service.dto.RetrieveRentDTO;
import com.ssafy.chaing.user.domain.UserEntity;
import com.ssafy.chaing.user.repository.UserRepository;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final ContractRepository contractRepository;
    private final ContractUserRepository contractUserRepository;

    @Override
    public RetrieveRentDTO retrieveRent(RetrieveRentCommand command) {
        UserEntity user = userRepository.findById(command.getUserId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));

        GroupEntity group = groupRepository.findById(user.getGroupId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));

        ContractEntity contract = contractRepository.findById(group.getContractId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.CONTRACT_NOT_FOUND));

        ContractUserEntity contractUser = contractUserRepository.findByContractIdAndUserId(contract.getId(), user.getId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));

        List<PaymentEntity> payments = paymentRepository.findALlByContractIdAndFeeType(contract.getId(), FeeType.RENT);

        int totalAmount = contract.getRentTotalAmount();
        int myAmount = contractUser.getRentAmount();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMM");
        int currentMonth = Integer.parseInt(ZonedDateTime.now(ZoneId.of("Asia/Seoul")).format(formatter));

    }
}
