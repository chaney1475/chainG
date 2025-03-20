package com.ssafy.chaing.contract.service;

import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import com.ssafy.chaing.contract.domain.ContractEntity;
import com.ssafy.chaing.contract.domain.ContractStatus;
import com.ssafy.chaing.contract.domain.ContractUserEntity;
import com.ssafy.chaing.contract.repository.ContractRepository;
import com.ssafy.chaing.contract.repository.UtilityCardRepository;
import com.ssafy.chaing.contract.service.command.ContractCommand;
import com.ssafy.chaing.contract.service.command.UserPaymentInfoCommand;
import com.ssafy.chaing.contract.service.dto.ContractDTO;
import com.ssafy.chaing.contract.service.dto.ContractDetailDTO;
import com.ssafy.chaing.group.domain.GroupEntity;
import com.ssafy.chaing.group.domain.GroupUserEntity;
import com.ssafy.chaing.group.repository.GroupRepository;
import com.ssafy.chaing.group.repository.GroupUserRepository;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ContractServiceImpl implements ContractService {

    private final GroupRepository groupRepository;
    private final ContractRepository contractRepository;
    private final UtilityCardRepository utilityCardRepository;
    private final GroupUserRepository groupUserRepository;

    @Override
    public ContractDTO createDraftContract(Long groupId, Long userId) {

        GroupEntity group = groupRepository.findById(groupId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));

        List<GroupUserEntity> members = groupUserRepository.findByGroupId(groupId);

        ContractEntity contract = ContractEntity.builder().group(group).contractUsers(new ArrayList<>()).build();

        List<ContractUserEntity> contractUsers = members.stream().map(
                member -> ContractUserEntity.builder()
                        .rentRatio(0)
                        .rentAmount(0)
                        .contract(contract)
                        .user(member.getUser())
                        .contractStatus(ContractStatus.PENDING)
                        .utilityRatio(0)
                        .build()
        ).toList();

        contract.addAll(contractUsers);
        contractRepository.save(contract);

        return ContractDTO.from(contract);
    }


    @Override
    public ContractDetailDTO getContract(Long contractId) {
        ContractEntity contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));

        return ContractDetailDTO.from(contract);
    }

    @Override
    public ContractDTO updateContract(Long contractId, ContractCommand command) {
        validateUpdateCommand(command);

        ContractEntity contractEntity = contractRepository.findById(contractId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));

        List<Long> contractUserIds = command.getRent().getUserPaymentInfo().stream().map(
                        UserPaymentInfoCommand::getUserId)
                .toList();

        ZonedDateTime startDate = command.getStartDate();
        ZonedDateTime endDate = command.getEndDate();
        contractEntity.setStartDate(startDate);
        contractEntity.setEndDate(endDate);
        contractEntity.setDueDate(command.getRent().getDueDate());
        contractEntity.setTotalRentRatio(command.getRent().getTotalRatio());
        ContractEntity updatedContract = contractRepository.save(contractEntity);

        return ContractDTO.from(updatedContract);
    }

    private void validateUpdateCommand(ContractCommand command) {
        if (command.getStartDate().isAfter(command.getEndDate())) {
            throw new BadRequestException("일자가 잘못되었어");
        }

        if (command.getRent().getTotalRatio() > 0 && command.getRent().getUserPaymentInfo().isEmpty()) {
            throw new BadRequestException("문제");
        }
    }
}
