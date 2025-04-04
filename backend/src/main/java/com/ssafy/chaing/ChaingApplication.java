package com.ssafy.chaing;

import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.contract.domain.ContractEntity;
import com.ssafy.chaing.contract.domain.UtilityCardEntity;
import com.ssafy.chaing.contract.repository.ContractRepository;
import com.ssafy.chaing.contract.repository.UtilityCardRepository;
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
import java.time.ZonedDateTime;
import java.util.List;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

@EnableJpaAuditing
@SpringBootApplication
@EnableBatchProcessing
@EnableScheduling
public class ChaingApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChaingApplication.class, args);
    }

    //    @Profile("!test")
    @Bean
    public CommandLineRunner init(
            UserRepository userRepository,
            GroupService groupService,
            UtilityCardRepository utilityCardRepository,
            PasswordEncoder passwordEncoder,
            ContractService contractService,
            ContractRepository contractRepository
    ) {
        return args -> {
            for (int i = 0; i < 4; i++) {
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

            UserEntity creator = users.get(1);

            GroupDTO group = groupService.createGroup(new CreateGroupCommand(
                    creator.getId(), "nickname", "profile", "testGroup", 3
            ));

            groupService.joinGroup(new JoinGroupCommand(users.get(2).getId(), group.getId(), "message1", "info1"));
            groupService.joinGroup(new JoinGroupCommand(users.get(3).getId(), group.getId(), "message2", "info2"));

            UtilityCardEntity card = UtilityCardEntity.builder().cardNo("1111").cvc("11").build();
            utilityCardRepository.save(card);

            // ✅ Contract 생성 로직 통합
            ContractDTO draftContract = contractService.createDraftContract(group.getId(), creator.getId());

            ConfirmContractCommand confirmContractCommand = new ConfirmContractCommand(
                    creator.getId(),
                    ZonedDateTime.now(),
                    ZonedDateTime.now().plusMonths(1),
                    new ConfirmContractCommand.ConfirmRentCommand(
                            10000,
                            10,
                            "0015632899269172",
                            "0012860463440599",
                            3,
                            List.of(
                                    new ConfirmContractCommand.ConfirmRentCommand.ConfirmUserPaymentCommand(
                                            users.get(1).getId(), 3333, 1),
                                    new ConfirmContractCommand.ConfirmRentCommand.ConfirmUserPaymentCommand(
                                            users.get(2).getId(), 3333, 1),
                                    new ConfirmContractCommand.ConfirmRentCommand.ConfirmUserPaymentCommand(
                                            users.get(3).getId(), 3333, 1)
                            )
                    ),
                    new ConfirmContractCommand.ConfirmUtilityCommand(null)
            );

            contractService.confirmContract(draftContract.getId(), confirmContractCommand);

            contractService.approveContract(draftContract.getId(),
                    new ApproveContractCommand(users.get(1).getId(), "0016876352742020"));
            contractService.approveContract(draftContract.getId(),
                    new ApproveContractCommand(users.get(2).getId(), "0019468386865145"));
            contractService.approveContract(draftContract.getId(),
                    new ApproveContractCommand(users.get(3).getId(), "0010624269496821"));

            ContractEntity finalContract = contractRepository.findById(draftContract.getId())
                    .orElseThrow(() -> new BadRequestException("계약이 없습니다."));

            System.out.println("✅ 테스트용 계약 생성 완료: " + finalContract.getId());
        };
    }
}
