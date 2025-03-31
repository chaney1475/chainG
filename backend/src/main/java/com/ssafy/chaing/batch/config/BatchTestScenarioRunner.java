package com.ssafy.chaing.batch.config;

import com.ssafy.chaing.batch.service.RentBatchService;
import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.contract.domain.ContractEntity;
import com.ssafy.chaing.contract.repository.ContractRepository;
import com.ssafy.chaing.contract.service.ContractService;
import com.ssafy.chaing.contract.service.command.ApproveContractCommand;
import com.ssafy.chaing.contract.service.command.ConfirmContractCommand;
import com.ssafy.chaing.contract.service.dto.ContractDTO;
import com.ssafy.chaing.group.service.GroupService;
import com.ssafy.chaing.group.service.command.CreateGroupCommand;
import com.ssafy.chaing.group.service.command.JoinGroupCommand;
import com.ssafy.chaing.group.service.dto.GroupDTO;
import com.ssafy.chaing.user.domain.RoleType;
import com.ssafy.chaing.user.domain.UserEntity;
import com.ssafy.chaing.user.repository.UserRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
//@Component
@RequiredArgsConstructor
public class BatchTestScenarioRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final GroupService groupService;
    private final ContractService contractService;
    private final ContractRepository contractRepository;
    private final RentBatchService rentBatchService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("🚀 통합 시나리오 실행 시작");

        ZonedDateTime now = ZonedDateTime.now();
        int nowHour = now.getHour();
        int nowMinute = now.getMinute();

        rentBatchService.setCollectTime(new ExecutionTime(nowHour, (nowMinute + 1) % 60, 0));
        rentBatchService.setPayTime(new ExecutionTime(nowHour, (nowMinute + 2) % 60, 0));
        rentBatchService.setRetryTime(new ExecutionTime(nowHour, (nowMinute + 3) % 60, 0));

        UserEntity admin = UserEntity.builder()
                .name("어드민")
                .emailAddress("admin@ssafy.com")
                .build();

        userRepository.save(admin);

        // 유저 생성 및 계약 3개 생성
        List<UserEntity> users1 = createUsers("u1");
        List<UserEntity> users2 = createUsers("u2");
        List<UserEntity> users3 = createUsers("u3");

        ContractEntity contract1 = setUpContract(users1);
        ContractEntity contract2 = setUpContract(users2);
        ContractEntity contract3 = setUpContract(users3);

        // Contract1 → 즉시 approve
        // Step 2: 유저 승인 (→ 내부적으로 registerNextMonthPayment 호출)

        contractService.approveContract(contract1.getId(),
                new ApproveContractCommand(users1.get(0).getId(), "0016876352742020"));
        contractService.approveContract(contract1.getId(),
                new ApproveContractCommand(users1.get(1).getId(), "0019468386865145"));
        contractService.approveContract(contract1.getId(),
                new ApproveContractCommand(users1.get(2).getId(), "0010624269496821"));

//        contractService.approveContract(contract1.getId(),
//                new ApproveContractCommand(users1.get(2).getId(), "111"));

        contractService.approveContract(contract2.getId(),
                new ApproveContractCommand(users2.get(0).getId(), "0016876352742020"));
        contractService.approveContract(contract2.getId(),
                new ApproveContractCommand(users2.get(1).getId(), "0019468386865145"));

        // Contract2 → 1분 뒤 approve
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                log.info("Contract2 1분 뒤 승인");
                contractService.approveContract(contract2.getId(),
                        new ApproveContractCommand(users2.get(2).getId(), "0010624269496821"));
            }
        }, 60_000);

    }

    private List<UserEntity> createUsers(String prefix) {
        List<UserEntity> users = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            UserEntity user = UserEntity.builder()
                    .emailAddress(prefix + "_test" + i + "@test.com")
                    .password(passwordEncoder.encode("password1!"))
                    .name(prefix + "_test" + i)
                    .nickname(prefix + "_test" + i)
                    .roleType(RoleType.USER)
                    .build();
            userRepository.save(user);
            users.add(user);
        }
        return users;
    }

    private ContractEntity setUpContract(List<UserEntity> users) {
        UserEntity creator = users.get(0);
        GroupDTO group = groupService.createGroup(new CreateGroupCommand(
                creator.getId(), "nickname", "profile", "testGroup", 3
        ));

        groupService.joinGroup(new JoinGroupCommand(users.get(1).getId(), group.getId(), "message1", "info1"));
        groupService.joinGroup(new JoinGroupCommand(users.get(2).getId(), group.getId(), "message2", "info2"));

        ContractDTO draftContract = contractService.createDraftContract(group.getId(), creator.getId());

        ZonedDateTime nowInKorea = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
        LocalDate koreanDate = nowInKorea.toLocalDate();

        ConfirmContractCommand confirmContractCommand = new ConfirmContractCommand(
                creator.getId(),
                ZonedDateTime.now(),
                ZonedDateTime.now().plusMonths(6),
                new ConfirmContractCommand.ConfirmRentCommand(
                        10000,
                        koreanDate.getDayOfMonth(),
                        "0015632899269172",
                        "0012860463440599",
                        3,
                        List.of(
                                new ConfirmContractCommand.ConfirmRentCommand.ConfirmUserPaymentCommand(
                                        users.get(0).getId(), 3333, 1
                                ),
                                new ConfirmContractCommand.ConfirmRentCommand.ConfirmUserPaymentCommand(
                                        users.get(1).getId(), 3333, 1
                                ),
                                new ConfirmContractCommand.ConfirmRentCommand.ConfirmUserPaymentCommand(
                                        users.get(2).getId(), 3333, 1
                                )
                        )
                ),
                new ConfirmContractCommand.ConfirmUtilityCommand(null)
        );

        contractService.confirmContract(draftContract.getId(), confirmContractCommand);

        return contractRepository.findByIdWithMembers(draftContract.getId())
                .orElseThrow(() -> new BadRequestException("계약이 없습니다."));
    }
}