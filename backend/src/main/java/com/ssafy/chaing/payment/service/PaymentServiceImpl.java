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
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
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
        Integer year = Integer.valueOf(command.getYear());
        Integer month = Integer.valueOf(command.getMonth());

        // 관련 엔티티 조회
        UserEntity user = getUserEntity(userId);
        GroupEntity group = getGroupEntity(user);
        ContractEntity contract = getContractEntity(group);
        ContractUserEntity contractUser = getContractUserEntity(contract.getId(), userId);

        // 결제 데이터 처리
        List<PaymentEntity> payments = paymentRepository.findAllByContractIdAndFeeType(contract.getId(), FeeType.RENT);
        int currentMonth = getCurrentMonth();

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

        TransferDTO result = fintechService.transfer(dto);

        if (!result.isSuccess()) {
            throw new BadRequestException(ExceptionCode.FINTECH_TRANSFER_FAILED);
        }

        payment.updatePaidDate(ZonedDateTime.now(ZoneOffset.UTC));
        payment.setStatus(PaymentStatus.PAID);

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
        TransferDTO result = fintechService.transfer(
                new TransferCommand(
                        userPayment.getId(),
                        contract.getId(),
                        (long) payment.getMonth(),
                        user.getName() + "의 계좌: " + contractUser.getAccountNo().substring(0, 4),
                        contractUser.getAccountNo(),
                        payment.getContract().getGroup().getName() + "의 공동 계좌: " + payment.getContract().getRentAccountNo().substring(0, 4),
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
        Integer year = Integer.valueOf(command.getYear());
        Integer month = Integer.valueOf(command.getMonth());

        // 관련 엔티티 조회
        UserEntity user = getUserEntity(userId);
        GroupEntity group = getGroupEntity(user);
        ContractEntity contract = getContractEntity(group);

        // 현재 월과 주 가져오기
        int currentMonth = formatToYearMonth(year, month);

        // 현재 달의 모든 공과금 결제 정보 조회 (주 별로 내림차순 정렬)
        List<PaymentEntity> currentMonthPayments = paymentRepository.findAllByContractIdAndFeeTypeAndMonthOrderByWeekDesc(
                contract.getId(),
                FeeType.UTILITY,
                currentMonth);

        // 결제 정보 처리
        Map<Long, List<UserPaymentEntity>> userPaymentsByPaymentId = getUserPaymentsByPaymentId(currentMonthPayments);

        // 현재 주(가장 최신 주) 결제 정보
        List<CurrentPaymentDTO> currentWeekPayments = getCurrentWeekUtilityPayments(
                currentMonthPayments, userPaymentsByPaymentId);

        // 내 금액 계산 (현재 주에 대해)
        int myAmount = currentWeekPayments.stream()
                .filter(payment -> payment.getUserId().equals(userId))
                .mapToInt(CurrentPaymentDTO::getAmount)
                .sum();

        // 주별 결제 요약 (현재 달만)
        List<WeekPaymentDTO> weekList = getWeekPaymentSummaries(currentMonthPayments, userPaymentsByPaymentId);

        return new RetrieveUtilityDTO(
                contract.getRentTotalAmount(),
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

        boolean rentPaid = false;
        boolean userRentPaid = false;
        boolean utilityPaid = false;
        boolean userUtilityPaid = false;

        // contractId가 null이거나 조회 실패하면 기본 상태로 리턴
        Long contractId = group.getContractId();
        if (contractId == null) {
            return new PaymentOverviewDTO(group.getName(), false, false, false, false);
        }

        ContractEntity contract = contractRepository.findById(contractId).orElse(null);
        if (contract == null) {
            return new PaymentOverviewDTO(group.getName(), false, false, false, false);
        }

        ContractUserEntity contractUser = contractUserRepository
                .findByContractIdAndUserId(contract.getId(), userId)
                .orElse(null);

        if (contractUser == null) {
            return new PaymentOverviewDTO(group.getName(), false, false, false, false);
        }

        int dueDate = contract.getDueDate();
        int targetMonth = calculateTargetMonthByDueDate(dueDate);

        PaymentEntity rentPayment = paymentRepository
                .findWithUsersByContractIdAndMonthAndFeeType(contract.getId(), targetMonth, FeeType.RENT)
                .orElse(null);

        if (rentPayment != null && rentPayment.getStatus() == PaymentStatus.PAID) {
            rentPaid = true;
        }

        UserPaymentEntity rentUserPayment = rentPayment != null
                ? userPaymentRepository.findByPaymentIdAndContractMemberId(rentPayment.getId(), userId).orElse(null)
                : null;

        if (rentUserPayment != null && rentUserPayment.getStatus() == PaymentStatus.COLLECTED) {
            userRentPaid = true;
        }

        PaymentEntity utilityPayment = paymentRepository
                .findTopByContractIdAndFeeTypeOrderByMonthDescWeekDesc(contract.getId(), FeeType.UTILITY)
                .orElse(null);

        if (utilityPayment != null && utilityPayment.getStatus() == PaymentStatus.COLLECTED) {
            utilityPaid = true;
        }

        UserPaymentEntity utilityUserPayment = utilityPayment != null
                ? userPaymentRepository.findByPaymentIdAndContractMemberId(utilityPayment.getId(), userId).orElse(null)
                : null;

        if (utilityUserPayment != null && utilityUserPayment.getStatus() == PaymentStatus.COLLECTED) {
            userUtilityPaid = true;
        }

        return new PaymentOverviewDTO(
                group.getName(),
                rentPaid,
                userRentPaid,
                utilityPaid,
                userUtilityPaid
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
            final List<PaymentEntity> payments,
            final Map<Long, List<UserPaymentEntity>> userPaymentsByPaymentId) {

        // 가장 최신 주 찾기 (정렬된 리스트에서 첫 번째 항목의 주)
        if (payments.isEmpty()) {
            return Collections.emptyList();
        }

        int latestWeek = payments.get(0).getWeek();

        return payments.stream()
                .filter(payment -> payment.getWeek() == latestWeek) // 현재 주 데이터만 필터링
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

    private List<MonthPaymentDTO> getMonthPaymentSummaries(
            final List<PaymentEntity> payments,
            final Map<Long, List<UserPaymentEntity>> userPaymentsByPaymentId) {

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
            final List<PaymentEntity> currentMonthPayments,
            final Map<Long, List<UserPaymentEntity>> userPaymentsByPaymentId) {

        // 주별로 결제 데이터 그룹화
        Map<Integer, List<PaymentEntity>> paymentsByWeek = currentMonthPayments.stream()
                .collect(Collectors.groupingBy(PaymentEntity::getWeek));

        // 월 문자열 계산 (모든 결제가 같은 달이므로 첫 번째 항목에서 추출)
        String month = currentMonthPayments.isEmpty() ? "" :
                monthIntToString(currentMonthPayments.get(0).getMonth());

        return paymentsByWeek.entrySet().stream()
                .map(entry -> {
                    Integer week = entry.getKey();
                    List<PaymentEntity> weekPayments = entry.getValue();

                    // 중복 ID 제거를 위해 Set 사용
                    Set<Long> paidUserIds = new HashSet<>();
                    Set<Long> debtUserIds = new HashSet<>();

                    for (PaymentEntity payment : weekPayments) {
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

                    return new WeekPaymentDTO(
                            month,
                            week,
                            new ArrayList<>(paidUserIds),
                            new ArrayList<>(debtUserIds)
                    );
                })
                // 주 내림차순으로 정렬
                .sorted(Comparator.comparing(WeekPaymentDTO::getWeek, Comparator.reverseOrder()))
                .collect(Collectors.toList());
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
