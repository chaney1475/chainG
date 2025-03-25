package com.ssafy.chaing.batch.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.ssafy.chaing.contract.domain.ContractEntity;
import com.ssafy.chaing.contract.domain.ContractUserEntity;
import com.ssafy.chaing.fintech.controller.request.TransferCommand;
import com.ssafy.chaing.fintech.service.FintechService;
import com.ssafy.chaing.fintech.service.dto.TransferDTO;
import com.ssafy.chaing.payment.domain.PaymentEntity;
import com.ssafy.chaing.payment.domain.PaymentStatus;
import com.ssafy.chaing.payment.domain.UserPaymentEntity;
import com.ssafy.chaing.payment.repository.PaymentRepository;
import com.ssafy.chaing.payment.repository.UserPaymentRepository;
import com.ssafy.chaing.user.domain.RoleType;
import com.ssafy.chaing.user.domain.UserEntity;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class RentBatchServiceTest {

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private FintechService fintechService;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private UserPaymentRepository userPaymentRepository;

    @Mock
    private TaskScheduler taskScheduler;

    @InjectMocks
    private RentBatchService rentBatchService;

    private ContractEntity contract;
    private List<ContractUserEntity> contractUsers;

    @BeforeEach
    void setUp() {
        contract = ContractEntity.builder()
                .id(1L)
                .dueDate(15)
                .rentTotalAmount(100000)
                .rentAccountNo("0014460169450607")
                .ownerAccountNo("0987654321")
                .build();

        // 사용자 생성
        contractUsers = createTestUsers(3);

        // 계약에 사용자 추가
        contract.setMembers(contractUsers);
    }

    /**
     * ✅ 사용자 생성 메서드
     */
    private List<ContractUserEntity> createTestUsers(int count) {
        List<ContractUserEntity> users = new ArrayList<>();

        for (int i = 1; i <= count; i++) {
            // UserEntity 생성
            UserEntity user = UserEntity.builder()
                    .emailAddress("test" + i + "@test.com")
                    .password("password1!")
                    .name("test" + i)
                    .nickname("test" + i)
                    .roleType(RoleType.USER)
                    .build();

            // ContractUserEntity 생성
            ContractUserEntity contractUser = ContractUserEntity.builder()
                    .id((long) i)
                    .accountNo("111111" + i)
                    .rentAmount(50000)
                    .contract(contract)
                    .build();

            users.add(contractUser);
        }

        return users;
    }

    @Test
    void testRegisterNextMonthPayment() {
        // Given
        when(paymentRepository.save(any(PaymentEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        doNothing().when(taskScheduler).schedule(any(Runnable.class), any(Date.class));

        // When
        rentBatchService.registerNextMonthPayment(contract);

        // Then
        ArgumentCaptor<PaymentEntity> captor = ArgumentCaptor.forClass(PaymentEntity.class);
        verify(paymentRepository).save(captor.capture());

        PaymentEntity savedPayment = captor.getValue();
        assertThat(savedPayment.getContract()).isEqualTo(contract);
        assertThat(savedPayment.getTotalAmount()).isEqualTo(100000);
        assertThat(savedPayment.getStatus()).isEqualTo(PaymentStatus.STARTED);

        // 배치 등록이 되었는지 검증
        verify(taskScheduler, times(2)).schedule(any(Runnable.class), any(Date.class));
    }

    @Test
    void testCollectToJointAccountSuccess() {
        // Given
        PaymentEntity payment = PaymentEntity.builder()
                .id(1L)
                .contract(contract)
                .totalAmount(100000)
                .status(PaymentStatus.STARTED)
                .build();

        when(fintechService.transfer(any(TransferCommand.class)))
                .thenReturn(new TransferDTO(true));

        // When
        rentBatchService.collectToJointAccount(payment);

        // Then
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.COLLECTED);

        // 모든 사용자 송금 성공 확인
        verify(userPaymentRepository, times(contractUsers.size())).save(any(UserPaymentEntity.class));
        verify(paymentRepository).save(payment);
    }

    @Test
    void testCollectToJointAccountPartialFail() {
        // Given
        PaymentEntity payment = PaymentEntity.builder()
                .id(1L)
                .contract(contract)
                .totalAmount(100000)
                .status(PaymentStatus.STARTED)
                .build();

        when(fintechService.transfer(any(TransferCommand.class)))
                .thenReturn(new TransferDTO(true))
                .thenReturn(new TransferDTO(false));

        // When
        rentBatchService.collectToJointAccount(payment);

        // Then
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.PARTIALLY_PAID);

        verify(userPaymentRepository, times(contractUsers.size())).save(any(UserPaymentEntity.class));
        verify(paymentRepository).save(payment);
    }

    @Test
    void testPayToOwnerSuccess() {
        // Given
        PaymentEntity payment = PaymentEntity.builder()
                .id(1L)
                .contract(contract)
                .totalAmount(100000)
                .status(PaymentStatus.COLLECTED)
                .build();

        when(fintechService.transfer(any(TransferCommand.class)))
                .thenReturn(new TransferDTO(true));

        // When
        rentBatchService.payToOwner(payment);

        // Then
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.PAID);
        verify(paymentRepository).save(payment);
    }

    @Test
    void testPayToOwnerFailure() {
        // Given
        PaymentEntity payment = PaymentEntity.builder()
                .id(1L)
                .contract(contract)
                .totalAmount(100000)
                .status(PaymentStatus.COLLECTED)
                .build();

        when(fintechService.transfer(any(TransferCommand.class)))
                .thenReturn(new TransferDTO(false));

        doNothing().when(taskScheduler).schedule(any(Runnable.class), any(Date.class));

        // When
        rentBatchService.payToOwner(payment);

        // Then
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.RETRY_PENDING);
        verify(paymentRepository).save(payment);
        verify(taskScheduler).schedule(any(Runnable.class), any(Date.class));
    }

}
