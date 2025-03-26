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
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
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
    private final UserPaymentRepository userPaymentRepository;

    @Override
    public RetrieveRentDTO retrieveRent(RetrieveRentCommand command) {
        UserEntity user = userRepository.findById(command.getUserId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));

        GroupEntity group = groupRepository.findById(user.getGroupId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));

        ContractEntity contract = contractRepository.findById(group.getContractId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.CONTRACT_NOT_FOUND));

        ContractUserEntity contractUser = contractUserRepository.findByContractIdAndUserId(contract.getId(),
                        user.getId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));

        List<PaymentEntity> payments = paymentRepository.findALlByContractIdAndFeeType(contract.getId(), FeeType.RENT);

        int totalAmount = contract.getRentTotalAmount();
        int myAmount = contractUser.getRentAmount();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMM");
        int currentMonth = Integer.parseInt(ZonedDateTime.now(ZoneId.of("Asia/Seoul")).format(formatter));

        // 현재 월에 해당하는 결제 내역을 PaymentInfoDTO 리스트로 변환 (userId는 command에서 받는 것으로 시뮬레이션)
        List<CurrentPaymentDTO> currentMonthPayments = new ArrayList<>();
        for (PaymentEntity payment : payments) {
            if (payment.getMonth() == currentMonth) {
                List<UserPaymentEntity> userPayments = userPaymentRepository.findAllByPaymentId(payment.getId());
                if (userPayments.isEmpty()) {
                    throw new BadRequestException(ExceptionCode.USER_PAYMENT_NOT_FOUND);
                }

                for (UserPaymentEntity userPayment : userPayments) {
                    CurrentPaymentDTO current = new CurrentPaymentDTO(
                            userPayment.getContractMember().getUser().getId(),
                            userPayment.getAmount(),
                            userPayment.getStatus() == PaymentStatus.PAID
                    );
                    currentMonthPayments.add(current);
                }
            }
        }

        // 월별로 결제 내역을 그룹화하여, 각 월의 납부/미납 사용자 ID 리스트를 생성합니다.
        // (PaymentEntity에 개별 사용자 정보가 없기 때문에 command.getUserId()로 단순 시뮬레이션 처리합니다)
        Map<Integer, List<PaymentEntity>> paymentsByMonth = payments.stream()
                .collect(Collectors.groupingBy(PaymentEntity::getMonth));

        List<MonthPaymentIDTO> monthList = paymentsByMonth.entrySet().stream()
                .map(entry -> {
                    MonthPaymentIDTO summary = new MonthPaymentIDTO();

                    // 월 정보: 예) "2025-3" 형식으로 변환 (간단히 연도-월로 표시)
                    int monthInt = entry.getKey();
                    String monthStr = monthIntToString(monthInt);
                    summary.setMonth(monthStr);

                    List<Long> paidUserIds = new ArrayList<>();
                    List<Long> debtUserIds = new ArrayList<>();

                    // 각 결제 내역에 대해 상태에 따라 사용자 ID를 분류합니다.
                    // (실제 사용자 정보가 있다면 각 PaymentEntity에서 사용자 ID를 가져와야 합니다)
                    for (PaymentEntity payment : entry.getValue()) {
                        List<UserPaymentEntity> userPayments = userPaymentRepository.findAllByPaymentId(
                                payment.getId());

                        for (UserPaymentEntity userPayment : userPayments) {
                            if(!Objects.equals(payment.getId(),
                                    userPayment.getPayment().getId())) continue;

                            if (payment.getStatus() == PaymentStatus.PAID) {
                                paidUserIds.add(command.getUserId());
                            } else {
                                debtUserIds.add(command.getUserId());
                            }

                        }

                    }
                    summary.setPaidUserIds(paidUserIds);
                    summary.setDebtUserIds(debtUserIds);
                    return summary;
                })
                .collect(Collectors.toList());

        // DTO에 결과 세팅
        return new RetrieveRentDTO(
                totalAmount,
                myAmount,
                contract.getDueDate(),
                currentMonthPayments,
                monthList
        );

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
