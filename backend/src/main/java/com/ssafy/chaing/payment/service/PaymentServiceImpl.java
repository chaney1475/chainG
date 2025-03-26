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
import com.ssafy.chaing.payment.domain.PaymentStatus;
import com.ssafy.chaing.payment.domain.UserPaymentEntity;
import com.ssafy.chaing.payment.repository.PaymentRepository;
import com.ssafy.chaing.payment.repository.UserPaymentRepository;
import com.ssafy.chaing.payment.service.command.RetrieveRentCommand;
import com.ssafy.chaing.payment.service.dto.CurrentPaymentDTO;
import com.ssafy.chaing.payment.service.dto.MonthPaymentIDTO;
import com.ssafy.chaing.payment.service.dto.RetrieveRentDTO;
import com.ssafy.chaing.user.domain.UserEntity;
import com.ssafy.chaing.user.repository.UserRepository;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private static final String DATE_FORMAT = "yyyyMM";
    private static final String TIMEZONE = "Asia/Seoul";

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final ContractRepository contractRepository;
    private final ContractUserRepository contractUserRepository;
    private final UserPaymentRepository userPaymentRepository;

    @Override
    public RetrieveRentDTO retrieveRent(RetrieveRentCommand command) {
        Objects.requireNonNull(command, "Command cannot be null");
        Long userId = command.getUserId();

        // 관련 엔티티 조회
        UserEntity user = getUserEntity(userId);
        GroupEntity group = getGroupEntity(user);
        ContractEntity contract = getContractEntity(group);
        ContractUserEntity contractUser = getContractUserEntity(contract.getId(), userId);

        // 결제 데이터 처리
        List<PaymentEntity> payments = paymentRepository.findALlByContractIdAndFeeType(contract.getId(), FeeType.RENT);
        int currentMonth = getCurrentMonth();

        // 결제 정보 처리
        Map<Long, List<UserPaymentEntity>> userPaymentsByPaymentId = getUserPaymentsByPaymentId(payments);

        // 현재 월 결제 정보
        List<CurrentPaymentDTO> currentMonthPayments = getCurrentMonthPayments(payments, currentMonth, userPaymentsByPaymentId);

        // 월별 결제 요약
        List<MonthPaymentIDTO> monthList = getMonthPaymentSummaries(payments, userPaymentsByPaymentId);

        return new RetrieveRentDTO(
                contract.getRentTotalAmount(),
                contractUser.getRentAmount(),
                contract.getDueDate(),
                currentMonthPayments,
                monthList
        );
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
                    List<UserPaymentEntity> userPayments = userPaymentsByPaymentId.getOrDefault(payment.getId(), List.of());
                    if (userPayments.isEmpty()) {
                        throw new BadRequestException(ExceptionCode.USER_PAYMENT_NOT_FOUND);
                    }

                    return userPayments.stream()
                            .map(up -> new CurrentPaymentDTO(
                                    up.getContractMember().getUser().getId(),
                                    up.getAmount(),
                                    up.getStatus() == PaymentStatus.PAID
                            ));
                })
                .collect(Collectors.toList());
    }

    private List<MonthPaymentIDTO> getMonthPaymentSummaries(
            final List<PaymentEntity> payments,
            final Map<Long, List<UserPaymentEntity>> userPaymentsByPaymentId) {

        Map<Integer, List<PaymentEntity>> paymentsByMonth = payments.stream()
                .collect(Collectors.groupingBy(PaymentEntity::getMonth));

        return paymentsByMonth.entrySet().stream()
                .map(entry -> {
                    int month = entry.getKey();
                    List<PaymentEntity> monthPayments = entry.getValue();

                    MonthPaymentIDTO summary = new MonthPaymentIDTO();
                    summary.setMonth(monthIntToString(month));

                    // 중복 ID 제거를 위해 Set 사용
                    Set<Long> paidUserIds = new HashSet<>();
                    Set<Long> debtUserIds = new HashSet<>();

                    for (PaymentEntity payment : monthPayments) {
                        List<UserPaymentEntity> userPayments = userPaymentsByPaymentId.getOrDefault(payment.getId(), List.of());

                        for (UserPaymentEntity userPayment : userPayments) {
                            Long userEntityId = userPayment.getContractMember().getUser().getId();
                            if (userPayment.getStatus() == PaymentStatus.PAID) {
                                paidUserIds.add(userEntityId);
                            } else {
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
