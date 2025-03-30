package com.ssafy.chaing.contract.service;

import static com.ssafy.chaing.common.exception.ExceptionCode.CONTRACT_ALREADY_EXIST;

import com.ssafy.chaing.batch.service.RentBatchService;
import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import com.ssafy.chaing.contract.domain.ContractEntity;
import com.ssafy.chaing.contract.domain.ContractStatus;
import com.ssafy.chaing.contract.domain.ContractUserEntity;
import com.ssafy.chaing.contract.domain.ContractUserStatus;
import com.ssafy.chaing.contract.domain.UtilityCardEntity;
import com.ssafy.chaing.contract.repository.ContractRepository;
import com.ssafy.chaing.contract.repository.ContractUserRepository;
import com.ssafy.chaing.contract.repository.UtilityCardRepository;
import com.ssafy.chaing.contract.service.command.ApproveContractCommand;
import com.ssafy.chaing.contract.service.command.ConfirmContractCommand;
import com.ssafy.chaing.contract.service.command.ConfirmContractCommand.ConfirmRentCommand.ConfirmUserPaymentCommand;
import com.ssafy.chaing.contract.service.command.DraftContractCommand;
import com.ssafy.chaing.contract.service.command.DraftContractCommand.RentCommand.UserPaymentCommand;
import com.ssafy.chaing.contract.service.dto.ContractDTO;
import com.ssafy.chaing.contract.service.dto.ContractDetailDTO;
import com.ssafy.chaing.contract.service.dto.ContractUserDTO;
import com.ssafy.chaing.group.domain.GroupEntity;
import com.ssafy.chaing.group.domain.GroupUserEntity;
import com.ssafy.chaing.group.repository.GroupRepository;
import com.ssafy.chaing.group.repository.GroupUserRepository;
import com.ssafy.chaing.user.domain.UserEntity;
import com.ssafy.chaing.user.repository.UserRepository;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class ContractServiceImpl implements ContractService {

    private final GroupRepository groupRepository;
    private final ContractRepository contractRepository;
    private final ContractUserRepository contractUserRepository;
    private final UtilityCardRepository utilityCardRepository;
    private final GroupUserRepository groupUserRepository;
    private final UserRepository userRepository;
    private final RentBatchService rentBatchService;

    @Transactional
    @Override
    public ContractDTO createDraftContract(Long groupId, Long userId) {

        GroupEntity group = groupRepository.findById(groupId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));

        List<GroupUserEntity> members = groupUserRepository.findByGroupId(groupId);

        if (group.getContractId() != null) {
            throw new BadRequestException(CONTRACT_ALREADY_EXIST);
        }

        ContractEntity contract = ContractEntity.builder()
                .group(group)
                .members(new ArrayList<>())
                .status(ContractStatus.DRAFT) // 쓰고 있는 상태로 지정
                .build();

        List<ContractUserEntity> contractUsers = members.stream().map(
                member -> ContractUserEntity.builder()
                        .rentRatio(0)
                        .rentAmount(0)
                        .contract(contract)
                        .user(member.getUser())
                        .contractStatus(ContractUserStatus.DRAFT)
                        .utilityRatio(1)
                        .build()
        ).toList();

        contract.addAll(contractUsers);

        UserEntity admin = userRepository.findById(1L)
                .orElseThrow(() -> new BadRequestException("어드민 유저가 없습니다."));

        ContractUserEntity remainUser = ContractUserEntity.builder()
                .user(admin)
                .contract(contract)
                .contractStatus(ContractUserStatus.CONFIRMED)
                .accountNo("0015613262817258")
                .isSurplusUser(true)
                .build();

        contract.add(remainUser);
        contractRepository.save(contract);
        group.setContractId(contract.getId());

        return ContractDTO.from(contract);
    }

    @Transactional(readOnly = true)
    public List<ContractUserDTO> getContractMembers(Long contractId) {
        // 계약에 포함된 사용자들 조회
        List<ContractUserEntity> contractUsers = contractUserRepository.findNonSurplusUsersByContractId(contractId);

        return contractUsers.stream()
                .map(ContractUserDTO::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void approveContract(Long contractId, ApproveContractCommand command) {

        ContractEntity contractEntity = contractRepository.findByIdWithMembers(contractId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));

        if (contractEntity.isCompleted()) {
            return;
        }

        ContractUserEntity contractUser = contractUserRepository.findByContractIdAndUserId(contractId,
                        command.getUserId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));

        if (contractUser.getContractStatus() == ContractUserStatus.CONFIRMED) {
            return;
        }

        // 상태를 CONFIRMED로 변경하고 계좌 정보 저장하고, 승인 처리 시간 저장
        contractUser.setAccountNo(command.getAccountNo());
        contractUser.updateContractStatus(ContractUserStatus.CONFIRMED);
        contractUser.setConfirmedAt(ZonedDateTime.now());

        contractUserRepository.save(contractUser);

        // TODO: 서약서 스마트 컨트랙트 저장 메서드를 비동기로 호출

        // TODO: 계약 완료시 월세 이체 잡 생성
        if (contractEntity.getStatus() == ContractStatus.CONFIRMED) {
            rentBatchService.registerNextMonthPayment(contractEntity);
        }
    }

    @Transactional(readOnly = true)
    @Override
    public ContractDetailDTO getContract(Long contractId) {
        ContractEntity contract = contractRepository.findByIdWithMembers(contractId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));

        return ContractDetailDTO.from(contract);
    }


    @Transactional
    @Override
    public ContractDetailDTO confirmContract(Long contractId, ConfirmContractCommand command) {

        validateUpdateCommand(command);

        ContractEntity contractEntity = contractRepository.findByIdWithMembers(contractId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));

        if (contractEntity.isCompleted()) {
            throw new BadRequestException(ExceptionCode.CONTRACT_ALREADY_CONFIRMED);
        }

        List<Long> contractUserIds = command.getRent().getUserPaymentInfo().stream().map(
                        ConfirmUserPaymentCommand::getUserId)
                .toList();

        ZonedDateTime startDate = command.getStartDate();
        ZonedDateTime endDate = command.getEndDate();
        contractEntity.setStartDate(startDate);
        contractEntity.setEndDate(endDate);
        contractEntity.setRentAccountNo(command.getRent().getRentAccountNo());
        contractEntity.setOwnerAccountNo(command.getRent().getOwnerAccountNo());
        contractEntity.setDueDate(command.getRent().getDueDate());
        contractEntity.setTotalRentRatio(command.getRent().getTotalRatio());
        contractEntity.setRentTotalAmount(command.getRent().getTotalAmount());
        contractEntity.setUtilityRatio(contractUserIds.size());

        if (command.getUtility().getCardId() != null) {
            UtilityCardEntity card = utilityCardRepository.findById(command.getUtility().getCardId())
                    .orElseThrow(() -> new BadRequestException(ExceptionCode.CARD_NOT_FOUND));

            contractEntity.setUtilityCard(card);
        }

        ContractEntity updatedContract = contractRepository.save(contractEntity);

        // 계약서의 계약자(사용자) 정보 업데이트
        // contractId와 contractUserIds로 한 번에 ContractUserEntity 조회
        List<ContractUserEntity> contractUserEntities = contractUserRepository.findByContractIdAndUserIdIn(contractId,
                contractUserIds);

        Map<Long, ContractUserEntity> contractUserMap = contractUserEntities.stream()
                .collect(Collectors.toMap(entity -> entity.getUser().getId(), entity -> entity));

        // 업데이트할 사용자 정보 처리
        int totalAmount = 0;

        for (ConfirmUserPaymentCommand userPayment : command.getRent().getUserPaymentInfo()) {
            Long userId = userPayment.getUserId();

            ContractUserEntity contractUserEntity = contractUserMap.get(userId);

            if (contractUserEntity == null) {
                throw new BadRequestException(ExceptionCode.USER_NOT_FOUND);
            }
            totalAmount += userPayment.getAmount();

            contractUserEntity.setRentRatio(userPayment.getRatio());
            contractUserEntity.setRentAmount(userPayment.getAmount());

            // 업데이트된 계약자 정보 저장
            contractUserRepository.save(contractUserEntity);
        }

        int remainingAmount = contractEntity.getRentTotalAmount() - totalAmount;

        ContractUserEntity surplusUser = contractUserRepository.findByContractIdAndIsSurplusUser(contractId, true)
                .orElseThrow(() -> new BadRequestException("나머지 유저를 찾을 수 없습니다."));

        // 비율은 null 유지하고 금액만 설정
        surplusUser.setRentAmount(remainingAmount);
        surplusUser.setContractStatus(ContractUserStatus.CONFIRMED);

        contractUserRepository.save(surplusUser);

        updateContractUserStatusForConfirmation(contractEntity, contractId);

        return ContractDetailDTO.from(updatedContract);
    }

    @Transactional
    @Override
    public ContractDetailDTO updateContract(Long contractId, DraftContractCommand command) {

        ContractEntity contractEntity = contractRepository.findById(contractId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));

        if (contractEntity.isCompleted()) {
            throw new BadRequestException(ExceptionCode.CONTRACT_ALREADY_CONFIRMED);
        }

        List<Long> contractUserIds = command.getRent().getUserPaymentInfo().stream().map(
                        UserPaymentCommand::getUserId)
                .toList();

        ZonedDateTime startDate = command.getStartDate();
        ZonedDateTime endDate = command.getEndDate();
        contractEntity.setStartDate(startDate);
        contractEntity.setEndDate(endDate);
        contractEntity.setRentAccountNo(command.getRent().getRentAccountNo());
        contractEntity.setOwnerAccountNo(command.getRent().getOwnerAccountNo());
        contractEntity.setDueDate(command.getRent().getDueDate());
        contractEntity.setTotalRentRatio(command.getRent().getTotalRatio());
        contractEntity.setRentTotalAmount(command.getRent().getTotalAmount());

        if (command.getUtility().getCardId() != null) {
            UtilityCardEntity card = utilityCardRepository.findById(command.getUtility().getCardId())
                    .orElseThrow(() -> new BadRequestException(ExceptionCode.CARD_NOT_FOUND));

            contractEntity.setUtilityCard(card);
        }

        ContractEntity updatedContract = contractRepository.save(contractEntity);

        // 계약서의 계약자(사용자) 정보 업데이트
        // contractId와 contractUserIds로 한 번에 ContractUserEntity 조회
        List<ContractUserEntity> contractUserEntities = contractUserRepository.findByContractIdAndUserIdIn(contractId,
                contractUserIds);

        Map<Long, ContractUserEntity> contractUserMap = contractUserEntities.stream()
                .collect(Collectors.toMap(entity -> entity.getUser().getId(), entity -> entity));

        // 업데이트할 사용자 정보 처리
        for (UserPaymentCommand userPayment : command.getRent().getUserPaymentInfo()) {
            Long userId = userPayment.getUserId();

            ContractUserEntity contractUserEntity = contractUserMap.get(userId);

            if (contractUserEntity == null) {
                throw new BadRequestException(ExceptionCode.USER_NOT_FOUND);
            }

            contractUserEntity.setRentRatio(userPayment.getRatio());
            contractUserEntity.setRentAmount(userPayment.getAmount());

            // 업데이트된 계약자 정보 저장
            contractUserRepository.save(contractUserEntity);
        }

        // 변경된 계약 정보를 DTO로 변환하여 반환
        return ContractDetailDTO.from(updatedContract);
    }

    private void validateUpdateCommand(ConfirmContractCommand command) {
        if (command.getStartDate().isAfter(command.getEndDate())) {
            throw new BadRequestException("시작 날짜가 종료 날짜보다 이후일 수 없습니다.");
        }

        int sumOfRatios = command.getRent().getUserPaymentInfo().stream()
                .mapToInt(ConfirmUserPaymentCommand::getRatio)
                .sum();

        if (sumOfRatios != command.getRent().getTotalRatio()) {
            throw new BadRequestException("사용자의 납부 비율 총합이 잘못되었습니다.");
        }

        if (command.getRent().getDueDate() < 2 || command.getRent().getDueDate() > 28) {
            throw new BadRequestException("납부 기한은 1일부터 28일 사이여야 합니다.");
        }

    }

    private void updateContractUserStatusForConfirmation(ContractEntity contract, Long contractId) {

        if (contract.getStatus() == ContractStatus.CONFIRMED) {
            contract.setStatus(ContractStatus.CONFIRMED);
        } else if (contract.getStatus() == ContractStatus.DRAFT) {
            contract.setStatus(ContractStatus.PENDING);
        }

        List<ContractUserEntity> contractUsers = contractUserRepository.findByContractId(contractId);

        for (ContractUserEntity contractUser : contractUsers) {
            switch (contractUser.getContractStatus()) {
                case DRAFT -> contractUser.setContractStatus(ContractUserStatus.PENDING);
                case CONFIRMED -> {
                    contractUser.setContractStatus(ContractUserStatus.REVIEW_REQUIRED);
                    contractUser.setConfirmedAt(null);
                }
                default -> {
                    // PENDING 상태는 유지
                }
            }
            contractUserRepository.save(contractUser);
        }
    }

}
