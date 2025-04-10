package com.ssafy.chaing.payment.service;

import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import com.ssafy.chaing.common.exception.NotFoundException;
import com.ssafy.chaing.contract.domain.ContractEntity;
import com.ssafy.chaing.contract.domain.ContractUserEntity;
import com.ssafy.chaing.contract.repository.ContractRepository;
import com.ssafy.chaing.contract.repository.ContractUserRepository;
import com.ssafy.chaing.fintech.controller.request.TransferCommand;
import com.ssafy.chaing.fintech.service.FintechService;
import com.ssafy.chaing.fintech.service.dto.TransferDTO;
import com.ssafy.chaing.group.domain.GroupEntity;
import com.ssafy.chaing.group.repository.GroupRepository;
import com.ssafy.chaing.notification.domain.NotificationCategory;
import com.ssafy.chaing.notification.service.NotificationService;
import com.ssafy.chaing.payment.controller.response.AccountInfoResponse;
import com.ssafy.chaing.payment.controller.response.PaymentStatusInfoResponse;
import com.ssafy.chaing.payment.domain.FeeType;
import com.ssafy.chaing.payment.domain.PaymentEntity;
import com.ssafy.chaing.payment.domain.PaymentStatus;
import com.ssafy.chaing.payment.domain.UserPaymentEntity;
import com.ssafy.chaing.payment.repository.PaymentRepository;
import com.ssafy.chaing.payment.repository.UserPaymentRepository;
import com.ssafy.chaing.payment.service.command.RetrieveRentCommand;
import com.ssafy.chaing.payment.service.command.RetrieveUtilityCommand;
import com.ssafy.chaing.payment.service.command.TransferRentCommand;
import com.ssafy.chaing.payment.service.dto.CurrentPaymentDTO;
import com.ssafy.chaing.payment.service.dto.MonthPaymentDTO;
import com.ssafy.chaing.payment.service.dto.PaymentOverviewDTO;
import com.ssafy.chaing.payment.service.dto.RetrieveRentDTO;
import com.ssafy.chaing.payment.service.dto.RetrieveUtilityDTO;
import com.ssafy.chaing.payment.service.dto.WeekPaymentDTO;
import com.ssafy.chaing.user.domain.UserEntity;
import com.ssafy.chaing.user.repository.UserRepository;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private static final String DATE_FORMAT = "yyyyMM";
    private static final String TIMEZONE = "UTC";

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final ContractRepository contractRepository;
    private final ContractUserRepository contractUserRepository;
    private final UserPaymentRepository userPaymentRepository;
    private final FintechService fintechService;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true, rollbackFor = Exception.class)
    public RetrieveRentDTO retrieveRent(RetrieveRentCommand command) {
        Long userId = command.getUserId();
        int year = Integer.valueOf(command.getYear());
        int month = Integer.valueOf(command.getMonth());

        // 관련 엔티티 조회
        UserEntity user = getUserEntity(userId);
        GroupEntity group = getGroupEntity(user);
        ContractEntity contract = getContractEntity(group);
        ContractUserEntity contractUser = getContractUserEntity(contract.getId(), userId);

        // 결제 데이터 처리
        List<PaymentEntity> payments = paymentRepository.findAllByContractIdAndFeeType(contract.getId(), FeeType.RENT);
        int currentMonth = formatToYearMonth(year, month);

        // 결제 정보 처리
        Map<Long, List<UserPaymentEntity>> userPaymentsByPaymentId = getUserPaymentsByPaymentId(payments);

        // 현재 월 결제 정보
        List<CurrentPaymentDTO> currentMonthPayments = getCurrentMonthPayments(payments, currentMonth,
                userPaymentsByPaymentId);

        // 월별 결제 요약
        List<MonthPaymentDTO> monthList = getMonthPaymentSummaries(payments, userPaymentsByPaymentId);

        return new RetrieveRentDTO(
                contract.getRentTotalAmount(),
                contractUser.getRentAmount(),
                contract.getDueDate(),
                currentMonthPayments,
                monthList
        );
    }

    @Override
    public AccountInfoResponse getRentAccountNo(Long userId) {
        ContractUserEntity contractUser = contractUserRepository.findByUser_Id(userId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.CONTRACT_USER_NOT_FOUND));
        String rentAccountNo = contractUser.getContract().getRentAccountNo();
        if (rentAccountNo == null) {
            throw new BadRequestException(ExceptionCode.RENT_ACCOUNT_ALREADY_EXIST);
        }
        return AccountInfoResponse.from(rentAccountNo);
    }

    @Override
    @Transactional
    public void transferToOwner(TransferRentCommand command) {

        UserEntity user = getUserEntity(command.getUserId());
        GroupEntity group = getGroupEntity(user);
        ContractEntity contract = getContractEntity(group);
        ContractUserEntity contractUser = getContractUserEntity(contract.getId(), command.getUserId());

        int targetMonth = command.getMonth(); // ex: 202510
        FeeType feeType = FeeType.RENT;

        PaymentEntity payment = paymentRepository
                .findWithUsersByContractIdAndMonthAndFeeType(contract.getId(), targetMonth, feeType)
                .orElseThrow(() -> new NotFoundException(ExceptionCode.USER_PAYMENT_NOT_FOUND));

        if (payment.getStatus().equals(PaymentStatus.PAID)) {
            throw new BadRequestException(ExceptionCode.ALREADY_PAID);
        }

        if (!payment.getStatus().equals(PaymentStatus.COLLECTED)) {
            throw new BadRequestException(ExceptionCode.PAY_NOT_COLLECTED);
        }

        TransferCommand dto = new TransferCommand(
                payment.getId(),
                payment.getContract().getId(),
                (long) payment.getMonth(),
                group.getName() + "의 대표 계좌: " + contract.getRentAccountNo().substring(0, 4),
                contract.getRentAccountNo(),
                group.getName() + "의 집주인 계좌: " + contract.getOwnerAccountNo().substring(0, 4),
                contract.getOwnerAccountNo(),
                payment.getTotalAmount(),
                false,
                ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toString(),
                payment.getFeeType(),
                group.getId(),
                null
        );

        TransferDTO result = fintechService.rentTransfer(dto);

        if (!result.isSuccess()) {
            throw new BadRequestException(ExceptionCode.FINTECH_TRANSFER_FAILED);
        }

        payment.updatePaidDate(ZonedDateTime.now(ZoneOffset.UTC));
        payment.setStatus(PaymentStatus.PAID);

        paymentRepository.save(payment);

        log.info("💸 유저 ID={} → 집주인에게 월세 수동 납부 완료. PaymentID={}",
                user.getId(), payment.getId());

        List<UserEntity> members = userRepository.findAllUsersInSameContract(command.getUserId());

        for (UserEntity member : members) {
            notificationService.sendNotification(
                    member.getId(),
                    "월세 송금 완료",
                    command.getBalance() + "원이 임대인에게 송금되었습니다.",
                    NotificationCategory.PAYMENT
            );
        }
    }

    @Override
    @Transactional
    public void depositToRentAccount(TransferRentCommand command) {

        UserEntity user = getUserEntity(command.getUserId());
        GroupEntity group = getGroupEntity(user);
        ContractEntity contract = getContractEntity(group);
        ContractUserEntity contractUser = getContractUserEntity(contract.getId(), command.getUserId());

        int targetMonth = command.getMonth(); // ex: 202510
        FeeType feeType = FeeType.RENT;

        PaymentEntity payment = paymentRepository
                .findWithUsersByContractIdAndMonthAndFeeType(contract.getId(), targetMonth, feeType)
                .orElseThrow(() -> new NotFoundException(ExceptionCode.USER_PAYMENT_NOT_FOUND));

        // 사용자에 대한 UserPaymentEntity 조회
        UserPaymentEntity userPayment = userPaymentRepository
                .findByPaymentIdAndContractMemberId(payment.getId(), contractUser.getId())
                .orElseThrow(() -> new NotFoundException(ExceptionCode.USER_PAYMENT_NOT_FOUND));

        // 이미 처리된 경우 중복 처리 방지
        if (userPayment.getStatus() == PaymentStatus.PAID || userPayment.getStatus() == PaymentStatus.COLLECTED) {
            throw new BadRequestException(ExceptionCode.ALREADY_PAID);
        }

        // 송금: 요청자가 본인 계좌에서 → 월세 계좌로 송금
        TransferDTO result = fintechService.rentTransfer(
                new TransferCommand(
                        userPayment.getId(),
                        contract.getId(),
                        (long) payment.getMonth(),
                        user.getName() + "의 계좌: " + contractUser.getAccountNo().substring(0, 4),
                        contractUser.getAccountNo(),
                        payment.getContract().getGroup().getName() + "의 공동 계좌: " + payment.getContract()
                                .getRentAccountNo().substring(0, 4),
                        payment.getContract().getRentAccountNo(),
                        command.getBalance(),
                        payment.getStatus() == PaymentStatus.COLLECTED,
                        ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toString(),
                        payment.getFeeType(),
                        null,
                        user.getId()
                )
        );

        if (!result.isSuccess()) {
            throw new BadRequestException(ExceptionCode.FINTECH_TRANSFER_FAILED);
        }

        payment.addPaidAmount(userPayment.getAmount());
        userPayment.updateStatus(PaymentStatus.COLLECTED);
        userPaymentRepository.save(userPayment);

        List<UserEntity> members = userRepository.findAllUsersInSameContract(command.getUserId());

        for (UserEntity member : members) {
            notificationService.sendNotification(
                    member.getId(),
                    "생활비 입금 완료",
                    command.getBalance() + "원이 생활비 계좌에 입금되었습니다.",
                    NotificationCategory.PAYMENT
            );
        }

        log.info("💸 유저 ID={} → 월세 수동 납부 완료. PaymentID={}, UserPaymentID={}",
                user.getId(), payment.getId(), userPayment.getId());

    }

    @Override
    @Transactional(readOnly = true, rollbackFor = Exception.class)
    public RetrieveUtilityDTO retrieveUtility(RetrieveUtilityCommand command) {
        Long userId = command.getUserId();
        // year, month 파라미터는 더 이상 직접 사용하지 않음 (항상 최신 기준 6주)

        // 관련 엔티티 조회
        UserEntity user = getUserEntity(userId);
        GroupEntity group = getGroupEntity(user);
        ContractEntity contract = getContractEntity(group);

        // 해당 계약의 모든 공과금 결제 정보 조회 (최신순 정렬)
        List<PaymentEntity> allUtilityPayments = paymentRepository.findAllByContractIdAndFeeTypeOrderByMonthDescWeekDesc(
                contract.getId(),
                FeeType.UTILITY
        );

        if (allUtilityPayments.isEmpty()) {
            // 공과금 내역이 없으면 빈 응답 반환 또는 기본값 처리
            return new RetrieveUtilityDTO(
                    0, // 또는 0
                    0, // myAmount
                    Collections.emptyList(), // currentWeekPayments
                    Collections.emptyList()  // weekList
            );
        }

        // 모든 관련 UserPayment 정보 조회
        Map<Long, List<UserPaymentEntity>> userPaymentsByPaymentId = getUserPaymentsByPaymentId(allUtilityPayments);

        // 현재 주(가장 최신 주) 결제 정보 계산 (이전 로직과 거의 동일, 입력 리스트만 변경됨)
        List<CurrentPaymentDTO> currentWeekPayments = getCurrentWeekUtilityPayments(
                allUtilityPayments, userPaymentsByPaymentId); // 이제 전체 리스트를 받아서 내부에서 최신 주 필터링

        int totalAmount = currentWeekPayments.stream()
                .map(CurrentPaymentDTO::getAmount)
                .reduce(0, Integer::sum);

        // 내 금액 계산 (현재 주에 대해)
        int myAmount = currentWeekPayments.stream()
                .filter(payment -> payment.getUserId().equals(userId))
                .mapToInt(CurrentPaymentDTO::getAmount)
                .sum();

        // 주별 결제 요약 (지난 6주)
        List<WeekPaymentDTO> weekList = getWeekPaymentSummaries(allUtilityPayments,
                userPaymentsByPaymentId); // 전체 리스트와 userPayment 맵 전달

        return new RetrieveUtilityDTO(
                totalAmount, // 필요시 공과금 총액 필드 추가 고려
                myAmount,
                currentWeekPayments,
                weekList
        );
    }

    @Transactional
    public PaymentEntity createPayment(ContractEntity contract, ZonedDateTime ownerExecution) {

        PaymentEntity payment = PaymentEntity.builder()
                .contract(contract)
                .month(ownerExecution.getYear() * 100 + ownerExecution.getMonthValue())
                .feeType(FeeType.RENT)
                .totalAmount(contract.getRentTotalAmount())
                .status(PaymentStatus.STARTED)
                .paidAmount(0)
                .retryCount(0)
                .build();

        payment.setNextExecutionDate(ownerExecution);
        PaymentEntity savedPayment = paymentRepository.save(payment);

        for (ContractUserEntity member : contract.getMembers()) {
            UserPaymentEntity userPayment = UserPaymentEntity.builder()
                    .payment(payment)
                    .contractMember(member)
                    .amount(member.getRentAmount())
                    .status(PaymentStatus.PENDING)
                    .build();
            userPaymentRepository.save(userPayment);
        }

        return savedPayment;

    }

    @Override
    public PaymentOverviewDTO getPaymentOverview(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));

        GroupEntity group = groupRepository.findById(user.getGroupId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));

        boolean rentPaid = true;
        boolean userRentPaid = true;
        boolean utilityPaid = true;
        boolean userUtilityPaid = true;

        // contractId가 null이거나 조회 실패하면 기본 상태로 리턴
        Long contractId = group.getContractId();
        if (contractId == null) {
            return new PaymentOverviewDTO(group.getName(), rentPaid, userRentPaid, utilityPaid, userUtilityPaid);
        }

        ContractEntity contract = contractRepository.findById(contractId).orElse(null);
        if (contract == null) {
            return new PaymentOverviewDTO(group.getName(), rentPaid, userRentPaid, utilityPaid, userUtilityPaid);
        }

        ContractUserEntity contractUser = contractUserRepository
                .findByContractIdAndUserId(contract.getId(), userId)
                .orElse(null);

        if (contractUser == null) {
            return new PaymentOverviewDTO(group.getName(), rentPaid, userRentPaid, utilityPaid, userUtilityPaid);
        }

        Integer dueDate = contract.getDueDate();

        if (dueDate == null) {
            return new PaymentOverviewDTO(group.getName(), rentPaid, userRentPaid, utilityPaid, userUtilityPaid);
        }

        int targetMonth = calculateTargetMonthByDueDate(dueDate);

        PaymentEntity rentPayment = paymentRepository
                .findWithUsersByContractIdAndMonthAndFeeType(contract.getId(), targetMonth, FeeType.RENT)
                .orElse(null);

        if (rentPayment != null &&
                (
                        rentPayment.getStatus() == PaymentStatus.PARTIALLY_PAID
                                || rentPayment.getStatus() == PaymentStatus.FAILED
                )
        ) {
            rentPaid = false;
        }

        UserPaymentEntity rentUserPayment = rentPayment != null
                ? userPaymentRepository.findByPaymentIdAndContractMemberId(rentPayment.getId(), contractUser.getId())
                .orElse(null)
                : null;

        if (rentUserPayment != null && rentUserPayment.getStatus() == PaymentStatus.FAILED) {
            userRentPaid = false;
        }

        PaymentEntity utilityPayment = paymentRepository
                .findTopByContractIdAndFeeTypeOrderByMonthDescWeekDesc(contract.getId(), FeeType.UTILITY)
                .orElse(null);

        if (utilityPayment != null &&
                (
                        utilityPayment.getStatus() == PaymentStatus.PARTIALLY_PAID
                                || utilityPayment.getStatus() == PaymentStatus.FAILED
                )) {
            utilityPaid = false;
        }

        UserPaymentEntity utilityUserPayment = utilityPayment != null
                ? userPaymentRepository.findByPaymentIdAndContractMemberId(utilityPayment.getId(), contractUser.getId())
                .orElse(null)
                : null;

        if (utilityUserPayment != null && utilityUserPayment.getStatus() == PaymentStatus.FAILED) {
            userUtilityPaid = false;
        }

        return new PaymentOverviewDTO(
                group.getName(),
                rentPaid,
                userRentPaid,
                utilityPaid,
                userUtilityPaid
        );
    }

    @Override
    public PaymentStatusInfoResponse getCurrentPaymentStatus(Long userId, int month) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));

        GroupEntity group = groupRepository.findById(user.getGroupId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));

        Long contractId = group.getContractId();
        if (contractId == null) {
            return new PaymentStatusInfoResponse(null, null, null, null);
        }

        ContractEntity contract = contractRepository.findById(contractId)
                .orElse(null);

        if (contract == null) {
            return new PaymentStatusInfoResponse(null, null, null, null);
        }

        ContractUserEntity contractUser = contractUserRepository
                .findByContractIdAndUserId(contract.getId(), userId)
                .orElse(null);

        if (contractUser == null) {
            return new PaymentStatusInfoResponse(null, null, null, null);
        }

        // RENT
        PaymentEntity rentPayment = paymentRepository
                .findWithUsersByContractIdAndMonthAndFeeType(contract.getId(), month, FeeType.RENT)
                .orElse(null);

        PaymentStatus rentStatus = rentPayment != null ? rentPayment.getStatus() : null;

        UserPaymentEntity rentUserPayment = rentPayment != null
                ? userPaymentRepository.findByPaymentIdAndContractMemberId(rentPayment.getId(), contractUser.getId())
                .orElse(null)
                : null;

        PaymentStatus userRentStatus = rentUserPayment != null ? rentUserPayment.getStatus() : null;

        // UTILITY
        PaymentEntity utilityPayment = paymentRepository
                .findTopByContractIdAndFeeTypeAndMonthOrderByWeekDesc(contract.getId(), FeeType.UTILITY, month)
                .orElse(null);

        PaymentStatus utilityStatus = utilityPayment != null ? utilityPayment.getStatus() : null;

        UserPaymentEntity utilityUserPayment = utilityPayment != null
                ? userPaymentRepository.findByPaymentIdAndContractMemberId(utilityPayment.getId(), contractUser.getId())
                .orElse(null)
                : null;

        PaymentStatus userUtilityStatus = utilityUserPayment != null ? utilityUserPayment.getStatus() : null;

        return new PaymentStatusInfoResponse(
                rentStatus,
                userRentStatus,
                utilityStatus,
                userUtilityStatus
        );
    }


    private int calculateTargetMonthByDueDate(int dueDateDay) {
        ZonedDateTime nowKST = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));

        int year = nowKST.getYear();
        int month = nowKST.getMonthValue();
        int day = nowKST.getDayOfMonth();

        if (day < dueDateDay) {
            // 이전 달로 이동
            month -= 1;
            if (month == 0) {
                month = 12;
                year -= 1;
            }
        }

        return year * 100 + month; // yyyyMM 형식으로 반환
    }

    private UserEntity getUserEntity(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));
    }

    private GroupEntity getGroupEntity(UserEntity user) {
        log.info("user group is = {} ", user.getGroupId());
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

    private int getCurrentMonth() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_FORMAT);
        return Integer.parseInt(ZonedDateTime.now(ZoneId.of(TIMEZONE)).format(formatter));
    }

    // year와 month를 yyyyMM 형식으로 변환하는 메서드 추가
    private int formatToYearMonth(Integer year, Integer month) {
        // year나 month가 null이면 현재 시간 정보로 대체
        if (year == null || month == null) {
            return getCurrentMonth(); // 기존 메서드 활용
        }

        if (year < 1000 || year > 9999) {
            throw new BadRequestException(ExceptionCode.INVALID_YEAR);
        }

        if (month < 1 || month > 12) {
            throw new BadRequestException(ExceptionCode.INVALID_MONTH);
        }

        // 월이 1~9인 경우 앞에 0을 붙임
        String monthStr = month < 10 ? "0" + month : String.valueOf(month);
        return Integer.parseInt(year + monthStr);
    }

    private Map<Long, List<UserPaymentEntity>> getUserPaymentsByPaymentId(List<PaymentEntity> payments) {
        List<Long> allPaymentIds = payments.stream()
                .map(PaymentEntity::getId)
                .collect(Collectors.toList());

        List<UserPaymentEntity> allUserPayments = userPaymentRepository.findAllByPaymentIdIn(allPaymentIds);

        return allUserPayments.stream()
                .collect(Collectors.groupingBy(up -> up.getPayment().getId()));
    }

    private List<CurrentPaymentDTO> getCurrentMonthPayments(
            final List<PaymentEntity> payments,
            final int currentMonth,
            final Map<Long, List<UserPaymentEntity>> userPaymentsByPaymentId) {

        return payments.stream()
                .filter(payment -> payment.getMonth() == currentMonth)
                .flatMap(payment -> {
                    List<UserPaymentEntity> userPayments = userPaymentsByPaymentId.getOrDefault(payment.getId(),
                            List.of());
                    if (userPayments.isEmpty()) {
                        throw new BadRequestException(ExceptionCode.USER_PAYMENT_NOT_FOUND);
                    }

                    return userPayments.stream()
                            .map(up -> new CurrentPaymentDTO(
                                    up.getContractMember().getUser().getId(),
                                    up.getAmount(),
                                    up.getStatus() == PaymentStatus.COLLECTED
                            ));
                })
                .collect(Collectors.toList());
    }

    private List<CurrentPaymentDTO> getCurrentWeekUtilityPayments(
            final List<PaymentEntity> sortedAllPayments, // 이름 변경: allUtilityPayments -> sortedAllPayments
            final Map<Long, List<UserPaymentEntity>> userPaymentsByPaymentId) {

        // 가장 최신 주 찾기 (정렬된 리스트에서 첫 번째 항목의 주)
        if (sortedAllPayments.isEmpty()) {
            return Collections.emptyList();
        }

        // 정렬되어 있으므로 첫번째 항목이 가장 최신 데이터
        PaymentEntity latestPayment = sortedAllPayments.getFirst();
        int latestMonth = latestPayment.getMonth();
        int latestWeek = latestPayment.getWeek();

        // 최신 월/주에 해당하는 PaymentEntity 필터링
        return sortedAllPayments.stream()
                .filter(payment -> payment.getMonth() == latestMonth
                        && payment.getWeek() == latestWeek) // 현재 월/주 데이터만 필터링
                .flatMap(payment -> {
                    List<UserPaymentEntity> userPayments = userPaymentsByPaymentId.getOrDefault(payment.getId(),
                            List.of());
                    // userPayments가 비어있는 경우는 데이터 정합성 문제일 수 있음 (로깅 또는 예외 처리 고려)
                    if (userPayments.isEmpty()) {
                        log.warn("UserPayments not found for Payment ID: {}", payment.getId());
                        // 혹은 throw new NotFoundException(...) 등
                        return Stream.empty(); // 일단 비어있는 스트림 반환
                    }

                    return userPayments.stream()
                            .map(up -> new CurrentPaymentDTO(
                                    up.getContractMember().getUser().getId(),
                                    up.getAmount(),
                                    up.getStatus() == PaymentStatus.COLLECTED || up.getStatus() == PaymentStatus.PAID
                                    // COLLECTED 또는 PAID 상태를 완료로 간주
                            ));
                })
                .collect(Collectors.toList());
    }

    private List<MonthPaymentDTO> getMonthPaymentSummaries(
            final List<PaymentEntity> payments,
            final Map<Long, List<UserPaymentEntity>> userPaymentsByPaymentId
    ) {
        Map<Integer, List<PaymentEntity>> paymentsByMonth = payments.stream()
                .collect(Collectors.groupingBy(PaymentEntity::getMonth));

        return paymentsByMonth.entrySet().stream()
                .map(entry -> {
                    int month = entry.getKey();
                    List<PaymentEntity> monthPayments = entry.getValue();

                    MonthPaymentDTO summary = new MonthPaymentDTO();
                    summary.setMonth(monthIntToString(month));

                    // 중복 ID 제거를 위해 Set 사용
                    Set<Long> paidUserIds = new HashSet<>();
                    Set<Long> debtUserIds = new HashSet<>();

                    for (PaymentEntity payment : monthPayments) {
                        List<UserPaymentEntity> userPayments = userPaymentsByPaymentId.getOrDefault(payment.getId(),
                                List.of());

                        for (UserPaymentEntity userPayment : userPayments) {
                            Long userEntityId = userPayment.getContractMember().getUser().getId();
                            if (userPayment.getStatus() == PaymentStatus.COLLECTED) {
                                paidUserIds.add(userEntityId);
                            } else if (userPayment.getStatus() == PaymentStatus.STARTED) {
                                debtUserIds.add(userEntityId);
                            }
                        }
                    }

                    summary.setPaidUserIds(new ArrayList<>(paidUserIds));
                    summary.setDebtUserIds(new ArrayList<>(debtUserIds));
                    return summary;
                })
                .collect(Collectors.toList());
    }

    private List<WeekPaymentDTO> getWeekPaymentSummaries(
            final List<PaymentEntity> allUtilityPayments,
            final Map<Long, List<UserPaymentEntity>> userPaymentsByPaymentId
    ) {
        if (allUtilityPayments.isEmpty()) {
            return Collections.emptyList();
        }

        Map<Integer, Map<Integer, List<PaymentEntity>>> groupedByMonthWeek = allUtilityPayments.stream()
                .collect(Collectors.groupingBy(
                        PaymentEntity::getMonth,
                        Collectors.groupingBy(PaymentEntity::getWeek)
                ));

        List<Map.Entry<Integer, Map<Integer, List<PaymentEntity>>>> monthEntries = new ArrayList<>(
                groupedByMonthWeek.entrySet());

        monthEntries.sort(Map.Entry.<Integer, Map<Integer, List<PaymentEntity>>>comparingByKey().reversed());

        List<WeekPaymentDTO> weeklySummaries = new ArrayList<>();

        int weekCount = 0;
        outerLoop:
        for (Map.Entry<Integer, Map<Integer, List<PaymentEntity>>> monthEntry : monthEntries) {
            Integer monthInt = monthEntry.getKey();
            String monthStr = monthIntToString(monthInt);

            List<Map.Entry<Integer, List<PaymentEntity>>> weekEntries = new ArrayList<>(
                    monthEntry.getValue().entrySet());
            weekEntries.sort(Map.Entry.<Integer, List<PaymentEntity>>comparingByKey().reversed());

            for (Map.Entry<Integer, List<PaymentEntity>> weekEntry : weekEntries) {
                if (weekCount >= 6) {
                    break outerLoop;
                }

                Integer week = weekEntry.getKey();
                List<PaymentEntity> weekPayments = weekEntry.getValue(); // 해당 주의 PaymentEntity 리스트

                int weeklyTotalAmount = weekPayments.stream()
                        .mapToInt(PaymentEntity::getTotalAmount)
                        .sum();

                Set<Long> paidUserIds = new HashSet<>();
                Set<Long> debtUserIds = new HashSet<>();

                for (PaymentEntity payment : weekPayments) {
                    List<UserPaymentEntity> userPayments = userPaymentsByPaymentId.getOrDefault(payment.getId(),
                            List.of());
                    for (UserPaymentEntity userPayment : userPayments) {
                        Long userEntityId = userPayment.getContractMember().getUser().getId();
                        if (userPayment.getStatus() == PaymentStatus.COLLECTED
                                || userPayment.getStatus() == PaymentStatus.PAID) {
                            paidUserIds.add(userEntityId);
                            debtUserIds.remove(userEntityId);
                        } else {
                            if (!paidUserIds.contains(userEntityId)) {
                                debtUserIds.add(userEntityId);
                            }
                        }
                    }
                }

                weeklySummaries.add(new WeekPaymentDTO(
                        monthStr,
                        week,
                        weeklyTotalAmount, // 계산된 주별 총액 추가
                        new ArrayList<>(paidUserIds),
                        new ArrayList<>(debtUserIds)
                ));
                weekCount++;
            }
        }
        return weeklySummaries;
    }

    private String monthIntToString(int monthInt) {
        String s = String.valueOf(monthInt);
        if (s.length() != 6) {
            return s;
        }
        String year = s.substring(0, 4);
        String month = s.substring(4);
        // 앞에 불필요한 0이 있다면 제거
        month = String.valueOf(Integer.parseInt(month));
        return year + "-" + month;
    }

}
