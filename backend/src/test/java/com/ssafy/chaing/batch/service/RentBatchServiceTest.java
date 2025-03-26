package com.ssafy.chaing.batch.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.contract.domain.ContractEntity;
import com.ssafy.chaing.contract.repository.ContractRepository;
import com.ssafy.chaing.contract.repository.ContractUserRepository;
import com.ssafy.chaing.contract.repository.UtilityCardRepository;
import com.ssafy.chaing.contract.service.ContractService;
import com.ssafy.chaing.contract.service.command.ApproveContractCommand;
import com.ssafy.chaing.contract.service.command.ConfirmContractCommand;
import com.ssafy.chaing.contract.service.dto.ContractDTO;
import com.ssafy.chaing.group.repository.GroupRepository;
import com.ssafy.chaing.group.service.GroupService;
import com.ssafy.chaing.group.service.command.CreateGroupCommand;
import com.ssafy.chaing.group.service.command.JoinGroupCommand;
import com.ssafy.chaing.group.service.dto.GroupDTO;
import com.ssafy.chaing.payment.domain.PaymentEntity;
import com.ssafy.chaing.payment.domain.PaymentStatus;
import com.ssafy.chaing.payment.repository.PaymentRepository;
import com.ssafy.chaing.user.domain.RoleType;
import com.ssafy.chaing.user.domain.UserEntity;
import com.ssafy.chaing.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import org.awaitility.Awaitility;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
public class RentBatchServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private ContractService contractService;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private GroupService groupService;

    @Autowired
    private ContractUserRepository contractUserRepository;

    @Autowired
    private UtilityCardRepository utilityCardRepository;

    @Autowired
    private RentBatchService rentBatchService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private EntityManager entityManager;

    private ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    private ContractEntity contract;

    private Clock fixedClock;

    @BeforeEach
    void setUp() {
        // ✅ Clock을 사용해 고정된 시간 설정
        fixedClock = Clock.fixed(Instant.now(), ZoneId.of("Asia/Seoul"));

        // ContractService를 통해 계약 생성 + 승인 상태까지 진행
        contract = setUpContract();

        // ✅ Clock 기반으로 실행 시간 설정
        ZonedDateTime now = ZonedDateTime.now(fixedClock);
        rentBatchService.setExecutionTime(
                now.getHour(),
                now.getMinute() + 1 // 1분 후 실행하도록 설정
        );
    }

    @Test
    void testRegisterNextMonthPayment() throws InterruptedException {
        // ✅ 배치 등록 실행
        rentBatchService.registerNextMonthPayment(contract);

        // ✅ Awaitility로 상태 변화를 기다림 (최대 5초까지 대기)
        Awaitility.await()
                .atMost(5, TimeUnit.SECONDS)
                .untilAsserted(() -> {
                    PaymentEntity payment = paymentRepository.findAll().get(0);

                    // ✅ 첫 번째 배치 실행 → 공동 계좌로 모으기
                    rentBatchService.collectToJointAccount(payment);

                    // ✅ 상태 동기화를 위해 flush() 호출
                    entityManager.flush();

                    // ✅ 상태 확인 (공동 계좌 상태 변경)
                    assertThat(payment.getStatus()).isEqualTo(PaymentStatus.COLLECTED);

                    // ✅ 두 번째 배치 실행 → 집주인에게 송금
                    rentBatchService.payToOwner(payment);

                    // ✅ 상태 동기화를 위해 flush() 호출
                    entityManager.flush();

                    // ✅ 상태 확인 (집주인 송금 상태 변경)
                    assertThat(payment.getStatus()).isEqualTo(PaymentStatus.PAID);
                });
    }

//    @Test
//    void testRetryWhenPaymentFails() throws InterruptedException {
//        // ✅ 배치 등록 실행
//        rentBatchService.registerNextMonthPayment(contract);
//
//        Awaitility.await()
//                .atMost(5, TimeUnit.SECONDS)
//                .untilAsserted(() -> {
//                    // ✅ 첫 번째 배치 실행 → 공동 계좌로 모으기
//                    PaymentEntity payment = paymentRepository.findAll().get(0);
//
//                    // ✅ 첫 번째 송금 실패 상태 강제 설정
//                    payment.updateStatus(PaymentStatus.PARTIALLY_PAID);
//                    paymentRepository.save(payment);
//                    entityManager.flush(); // ✅ 상태 동기화
//
//                    rentBatchService.collectToJointAccount(payment);
//
//                    // ✅ 상태 확인 → PARTIALLY_PAID 상태 확인
//                    assertThat(payment.getStatus()).isEqualTo(PaymentStatus.PARTIALLY_PAID);
//
//                    // ✅ 두 번째 송금 실패 상태 강제 설정
//                    rentBatchService.payToOwner(payment);
//                    payment.updateStatus(PaymentStatus.RETRY_PENDING);
//                    paymentRepository.save(payment);
//                    entityManager.flush(); // ✅ 상태 동기화
//
//                    // ✅ 상태 확인 (재시도 상태 확인)
//                    assertThat(payment.getStatus()).isEqualTo(PaymentStatus.RETRY_PENDING);
//
//                    // ✅ 재시도 실행 확인
//                    rentBatchService.registerRetryPayment(payment);
//
//                    PaymentEntity retryPayment = paymentRepository.findById(payment.getId()).get();
//                    assertThat(retryPayment.getRetryCount()).isEqualTo(1);
//                });
//    }

    ContractEntity setUpContract() {
        for (int i = 1; i <= 4; i++) {
            UserEntity user = UserEntity.builder()
                    .emailAddress("test" + i + "@test.com")
                    .password(passwordEncoder.encode("password1!"))
                    .name("test" + i)
                    .nickname("test" + i)
                    .roleType(RoleType.USER)
                    .build();
            userRepository.save(user);
        }

        List<UserEntity> users = userRepository.findAll();

        // 그룹 생성 → 사용자 2번이 그룹 생성
        UserEntity creator = users.get(1);
        GroupDTO group = groupService.createGroup(new CreateGroupCommand(
                creator.getId(), "nickname", "profile", "testGroup", 3
        ));

        // 그룹 참여 → 사용자 3번, 4번 참여
        groupService.joinGroup(new JoinGroupCommand(users.get(2).getId(), group.getId(), "message1", "info1"));
        groupService.joinGroup(new JoinGroupCommand(users.get(3).getId(), group.getId(), "message2", "info2"));

        // 빈 계약 생성 → 상태는 DRAFT
        ContractDTO draftContract = contractService.createDraftContract(group.getId(), creator.getId());

        // ✅ 실제 로직과 상태 동일하게 재현하기 위해 ConfirmContractCommand 생성
        ConfirmContractCommand confirmContractCommand = new ConfirmContractCommand(
                creator.getId(), // 계약을 승인할 사용자 ID
                ZonedDateTime.now(), // 시작일
                ZonedDateTime.now().plusMonths(1), // 종료일
                new ConfirmContractCommand.ConfirmRentCommand(
                        10000, // 총액
                        10, // 납부 기한 (예: 10일)
                        "0015632899269172", // 월세 계좌 번호
                        "0012860463440599", // 소유자 계좌 번호
                        3, // 총 비율 (1:1:1)
                        List.of(
                                new ConfirmContractCommand.ConfirmRentCommand.ConfirmUserPaymentCommand(
                                        users.get(1).getId(), 3333, 1
                                ),
                                new ConfirmContractCommand.ConfirmRentCommand.ConfirmUserPaymentCommand(
                                        users.get(2).getId(), 3333, 1
                                ),
                                new ConfirmContractCommand.ConfirmRentCommand.ConfirmUserPaymentCommand(
                                        users.get(3).getId(), 3333, 1
                                )
                        )
                ),
                new ConfirmContractCommand.ConfirmUtilityCommand(null) // 카드 ID 입력
        );

        contractService.confirmContract(draftContract.getId(), confirmContractCommand);

        contractService.approveContract(draftContract.getId(),
                new ApproveContractCommand(users.get(1).getId(), "0016876352742020"));

        contractService.approveContract(draftContract.getId(),
                new ApproveContractCommand(users.get(2).getId(), "0019468386865145"));

        contractService.approveContract(draftContract.getId(),
                new ApproveContractCommand(users.get(3).getId(), "0010624269496821"));

        return contractRepository.findById(draftContract.getId())
                .orElseThrow(() -> new BadRequestException("계약이 없습니다."));
    }
}
