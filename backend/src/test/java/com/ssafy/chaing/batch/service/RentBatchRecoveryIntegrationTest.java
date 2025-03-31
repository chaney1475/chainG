//package com.ssafy.chaing.batch.service;
//
//import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
//
//import com.ssafy.chaing.batch.config.BatchInitializer;
//import com.ssafy.chaing.common.exception.BadRequestException;
//import com.ssafy.chaing.contract.domain.ContractEntity;
//import com.ssafy.chaing.contract.repository.ContractRepository;
//import com.ssafy.chaing.contract.service.ContractService;
//import com.ssafy.chaing.contract.service.command.ConfirmContractCommand;
//import com.ssafy.chaing.contract.service.dto.ContractDTO;
//import com.ssafy.chaing.group.service.GroupService;
//import com.ssafy.chaing.group.service.command.CreateGroupCommand;
//import com.ssafy.chaing.group.service.command.JoinGroupCommand;
//import com.ssafy.chaing.group.service.dto.GroupDTO;
//import com.ssafy.chaing.payment.domain.PaymentEntity;
//import com.ssafy.chaing.payment.repository.PaymentRepository;
//import com.ssafy.chaing.payment.repository.UserPaymentRepository;
//import com.ssafy.chaing.user.domain.RoleType;
//import com.ssafy.chaing.user.domain.UserEntity;
//import com.ssafy.chaing.user.repository.UserRepository;
//import java.time.Duration;
//import java.time.ZonedDateTime;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.concurrent.TimeUnit;
//import org.awaitility.Awaitility;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.test.annotation.DirtiesContext;
//import org.springframework.test.context.ActiveProfiles;
//
//@SpringBootTest
//@ActiveProfiles("test")
//@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
//public class RentBatchRecoveryIntegrationTest {
//
//    @Autowired
//    private PaymentRepository paymentRepository;
//
//    @Autowired
//    private RentBatchService rentBatchService;
//
//    @Autowired
//    private UserPaymentRepository userPaymentRepository;
//
//    @Autowired
//    private ContractRepository contractRepository;
//
//    @Autowired
//    private ContractService contractService;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private GroupService groupService;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @Autowired
//    private BatchInitializer batchInitializer;
//
//    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(
//            RentBatchServiceWithSchedulerTest.class);
//
//    private ContractEntity contract;
//    private ContractEntity contract2;
//    private ContractEntity contract3;
//
//    private List<UserEntity> users1;
//    private List<UserEntity> users2;
//    private List<UserEntity> users3;
//
//    @BeforeEach
//    void setUp() {
//        users1 = createUsers("u1");
//        users2 = createUsers("u2");
//        users3 = createUsers("u3");
//
//        contract = setUpContract(users1);
//        contract2 = setUpContract(users2);
//        contract3 = setUpContract(users3);
//    }
//
//    @Test
//    void 실제_서버_재기동_시_batch_task_등록_및_실행_검증() {
//        // 1. PaymentEntity를 30초 뒤 실행하도록 저장
//
//        payment.setNextExecutionDate(ZonedDateTime.now().plusSeconds(30));
//        paymentRepository.save(payment);
//
//        // 2. 테스트 시작 시점에 Context 초기화 (DirtiesContext 덕분)
//        // BatchInitializer.run()이 자동 실행되며 task 등록됨
//
//        // 3. Awaitility로 실제 작업 실행을 기다림
//        Awaitility.await()
//                .atMost(1, TimeUnit.MINUTES)
//                .pollInterval(Duration.ofSeconds(3))
//                .untilAsserted(() -> {
//                    PaymentEntity updated = paymentRepository.findById(payment.getId()).orElseThrow();
//                    assertThat(updated.getRetryCount()).isGreaterThan(0);
//                });
//    }
//
//    private List<UserEntity> createUsers(String prefix) {
//        List<UserEntity> users = new ArrayList<>();
//        for (int i = 1; i <= 4; i++) {
//            UserEntity user = UserEntity.builder()
//                    .emailAddress(prefix + "_test" + i + "@test.com")
//                    .password(passwordEncoder.encode("password1!"))
//                    .name(prefix + "_test" + i)
//                    .nickname(prefix + "_test" + i)
//                    .roleType(RoleType.USER)
//                    .build();
//            userRepository.save(user);
//            users.add(user);
//        }
//        return users;
//    }
//
//    private ContractEntity setUpContract(List<UserEntity> users) {
//        UserEntity creator = users.get(1);
//        GroupDTO group = groupService.createGroup(new CreateGroupCommand(
//                creator.getId(), "nickname", "profile", "testGroup", 3
//        ));
//
//        groupService.joinGroup(new JoinGroupCommand(users.get(2).getId(), group.getId(), "message1", "info1"));
//        groupService.joinGroup(new JoinGroupCommand(users.get(3).getId(), group.getId(), "message2", "info2"));
//
//        ContractDTO draftContract = contractService.createDraftContract(group.getId(), creator.getId());
//
//        ConfirmContractCommand confirmContractCommand = new ConfirmContractCommand(
//                creator.getId(),
//                ZonedDateTime.now(),
//                ZonedDateTime.now().plusMonths(1),
//                new ConfirmContractCommand.ConfirmRentCommand(
//                        10000,
//                        10,
//                        "0015632899269172",
//                        "0012860463440599",
//                        3,
//                        List.of(
//                                new ConfirmContractCommand.ConfirmRentCommand.ConfirmUserPaymentCommand(
//                                        users.get(1).getId(), 3333, 1
//                                ),
//                                new ConfirmContractCommand.ConfirmRentCommand.ConfirmUserPaymentCommand(
//                                        users.get(2).getId(), 3333, 1
//                                ),
//                                new ConfirmContractCommand.ConfirmRentCommand.ConfirmUserPaymentCommand(
//                                        users.get(3).getId(), 3333, 1
//                                )
//                        )
//                ),
//                new ConfirmContractCommand.ConfirmUtilityCommand(null)
//        );
//
//        contractService.confirmContract(draftContract.getId(), confirmContractCommand);
//
//        return contractRepository.findByIdWithMembers(draftContract.getId())
//                .orElseThrow(() -> new BadRequestException("계약이 없습니다."));
//    }
//
//}
//
