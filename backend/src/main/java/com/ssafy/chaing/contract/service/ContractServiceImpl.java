package com.ssafy.chaing.contract.service;

import static com.ssafy.chaing.common.exception.ExceptionCode.AlREADY_CONFIRMED_CONTRACT;
import static com.ssafy.chaing.common.exception.ExceptionCode.AlREADY_CONFIRMED_USER;
import static com.ssafy.chaing.common.exception.ExceptionCode.CONTRACT_ALREADY_EXIST;

import com.ssafy.chaing.batch.service.RentBatchService;
import com.ssafy.chaing.blockchain.handler.contract.ContractHandler;
import com.ssafy.chaing.blockchain.handler.contract.input.ContractInput;
import com.ssafy.chaing.blockchain.handler.contract.input.PaymentInfoInput;
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
import com.ssafy.chaing.notification.domain.NotificationCategory;
import com.ssafy.chaing.notification.service.NotificationService;
import com.ssafy.chaing.user.domain.UserEntity;
import com.ssafy.chaing.user.repository.UserRepository;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
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
    private final NotificationService notificationService;
    private final ContractHandler contractHandler;

    @Transactional
    @Override
    public ContractDTO createDraftContract(Long groupId, Long userId) {

        GroupEntity group = groupRepository.findById(groupId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));

        List<GroupUserEntity> members = groupUserRepository.findByGroupId(groupId);

        if (group.getContractId() != null && group.getContractId() > 0) {
            throw new BadRequestException(CONTRACT_ALREADY_EXIST);
        }

        ContractEntity contract = ContractEntity.builder()
                .group(group)
                .members(new ArrayList<>())
                .status(ContractStatus.DRAFT) // 쓰고 있는 상태로 지정
                .isCreatedPdf(false)
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

        for (GroupUserEntity member : members) {
            notificationService.sendNotification(
                    member.getUser().getId(),
                    "계약서 초안 생성",
                    "그룹 [" + group.getName() + "]에 계약서 초안이 생성되었습니다.",
                    NotificationCategory.CONTRACT
            );
        }

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

        UserEntity user = getUserEntity(command.getUserId());
        GroupEntity group = getGroupEntity(user);
        ContractEntity contract = getContractEntity(group);
        ContractUserEntity contractUser = getContractUserEntity(contract.getId(), command.getUserId());

        ContractEntity contractEntity = contractRepository.findByIdWithMembers(contractId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));

        if (contractEntity.isCompleted()) {
            throw new BadRequestException(AlREADY_CONFIRMED_CONTRACT);
        }

        if (contractUser.getContractStatus() == ContractUserStatus.CONFIRMED) {
            throw new BadRequestException(AlREADY_CONFIRMED_USER);
        }

        // 상태를 CONFIRMED로 변경하고 계좌 정보 저장하고, 승인 처리 시간 저장
        contractUser.setAccountNo(command.getAccountNo());
        contractUser.updateContractStatus(ContractUserStatus.CONFIRMED);
        contractUser.setConfirmedAt(ZonedDateTime.now(ZoneOffset.UTC));

        contractUserRepository.save(contractUser);

        notificationService.sendNotification(
                command.getUserId(),
                "계약서 승인 완료",
                "계약서 승인이 완료되었습니다.",
                NotificationCategory.CONTRACT
        );

        // TODO: 계약 완료시 월세 이체 잡 생성
        if (contractEntity.getStatus() == ContractStatus.CONFIRMED) {
            rentBatchService.registerNextMonthPayment(contractEntity);

            // TODO: 서약서 스마트 컨트랙트 저장 메서드를 비동기로 호출
            List<PaymentInfoInput> paymentInfos = getPaymentInfoList(contract);
            ContractInput input = ContractInput.from(contract, paymentInfos);

            log.info("▶️▶️▶️비동기 호출 시작");

            CompletableFuture<Boolean> future = contractHandler.addContract(input);

            future.thenAccept(success -> {
                // 이 코드는 비동기 작업이 완료된 후 실행됩니다 (별도의 스레드에서)
                if (success) {
                    log.info("✨ 스마트 컨트랙트 등록 성공! 🚀");
                    contract.setIsCreatedPdf(true);
                    sendNotificationTo(
                            group,
                            "스마트 컨트랙트 등록 완료!",
                            "최근 승인된 서약서가 스마트 컨트랙트에 등록되었어요."
                    );
                } else {
                    log.error("❗ 스마트 컨트랙트 등록 실패 ❗");
                    sendNotificationTo(
                            group,
                            "스마트 컨트랙트 등록 실패!",
                            "최근 승인된 서약서가 스마트 컨트랙트 등록에 실패했어요."
                    );
                }
            }).exceptionally(ex -> {
                log.error("❗ 스마트 컨트랙트 등록 실패 ❗");
                sendNotificationTo(
                        group,
                        "스마트 컨트랙트 등록 실패!",
                        "최근 승인된 서약서가 스마트 컨트랙트 등록에 실패했어요."
                );
                return null;
            });
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

        List<ContractUserEntity> usersToNotify = contractUserRepository.findNonSurplusUsersByContractId(contractId);
        for (ContractUserEntity user : usersToNotify) {
            notificationService.sendNotification(
                    user.getUser().getId(),
                    "계약 확정 알림",
                    "계약이 최종 확정되었습니다.",
                    NotificationCategory.CONTRACT
            );
        }

        return ContractDetailDTO.from(updatedContract);
    }

    @Transactional
    @Override
    public ContractDetailDTO updateContract(Long contractId, DraftContractCommand command) {

        ContractEntity contractEntity = contractRepository.findById(contractId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));

        if (contractEntity.isCompleted() || contractEntity.getStatus() != ContractStatus.DRAFT) {
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

//        if (command.getRent().getDueDate() < 2 || command.getRent().getDueDate() > 28) {
//            throw new BadRequestException("납부 기한은 1일부터 28일 사이여야 합니다.");
//        }

    }

    private void updateContractUserStatusForConfirmation(ContractEntity contract, Long contractId) {

        if (contract.getStatus() == ContractStatus.CONFIRMED) {
            contract.setStatus(ContractStatus.CONFIRMED);
        } else if (contract.getStatus() == ContractStatus.DRAFT) {
            contract.setStatus(ContractStatus.PENDING);
        }

        List<ContractUserEntity> contractUsers = contractUserRepository.findByContractId(contractId);

        for (ContractUserEntity contractUser : contractUsers) {
            if (contractUser.isSurplusUser()) {
                continue;
            }

            ContractUserStatus previousStatus = contractUser.getContractStatus();

            // ✅ 알림 먼저 보냄
            switch (previousStatus) {
                case CONFIRMED -> notificationService.sendNotification(
                        contractUser.getUser().getId(),
                        "계약서 승인 무효화",
                        "계약서가 수정되어 기존 승인이 무효화되었습니다. 다시 확인해주세요.",
                        NotificationCategory.CONTRACT
                );
                case DRAFT -> notificationService.sendNotification(
                        contractUser.getUser().getId(),
                        "계약서 승인 요청",
                        "계약서 확정에 필요한 승인이 필요합니다. 내용을 확인해주세요.",
                        NotificationCategory.CONTRACT
                );
                default -> {

                }
            }

            //상태 변경
            switch (previousStatus) {
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

    private UserEntity getUserEntity(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));
    }

    private GroupEntity getGroupEntity(UserEntity user) {
        return groupRepository.findById(user.getGroupId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));
    }

    private ContractEntity getContractEntity(GroupEntity group) {
        return contractRepository.findById(group.getContractId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.CONTRACT_NOT_FOUND));
    }

    private ContractUserEntity getContractUserEntity(Long contractId, Long userId) {
        return contractUserRepository.findByContractIdAndUserId(contractId, userId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));
    }

    private List<PaymentInfoInput> getPaymentInfoList(ContractEntity contract) {
        List<ContractUserEntity> contractUsers = contractUserRepository.findByContractId(contract.getId());
        List<PaymentInfoInput> paymentInfoList = new ArrayList<>();
        contractUsers.forEach(contractUser -> {
            paymentInfoList.add(PaymentInfoInput.from(contractUser));
        });
        return paymentInfoList;
    }

    private void sendNotificationTo(GroupEntity group, String title, String content) {
        List<GroupUserEntity> members = groupUserRepository.findByGroupId(group.getId());
        members.forEach(member -> {
            notificationService.sendNotification(
                    member.getUser().getId(),
                    title,
                    content,
                    NotificationCategory.CONTRACT
            );
        });
    }
}
