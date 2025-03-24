package com.ssafy.chaing;

import com.ssafy.chaing.contract.domain.UtilityCardEntity;
import com.ssafy.chaing.contract.repository.UtilityCardRepository;
import com.ssafy.chaing.group.service.GroupService;
import com.ssafy.chaing.group.service.command.CreateGroupCommand;
import com.ssafy.chaing.group.service.command.JoinGroupCommand;
import com.ssafy.chaing.group.service.dto.GroupDTO;
import com.ssafy.chaing.user.domain.RoleType;
import com.ssafy.chaing.user.domain.UserEntity;
import com.ssafy.chaing.user.repository.UserRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;

@EnableJpaAuditing
@SpringBootApplication
public class ChaingApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChaingApplication.class, args);
    }

    @Bean
    public CommandLineRunner init(
            UserRepository userRepository,
            GroupService groupService,
            UtilityCardRepository utilityCardRepository,
            PasswordEncoder passwordEncoder
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

            UserEntity first = users.get(1);

            GroupDTO group = groupService.createGroup(new CreateGroupCommand(
                    first.getId(), "nickname", "profile", "testGroup", 3
            ));

            groupService.joinGroup(new JoinGroupCommand(users.get(2).getId(), group.getId(), "ddd", "dd"));
            groupService.joinGroup(new JoinGroupCommand(users.get(3).getId(), group.getId(), "ddddddd", "ddddd"));

            UtilityCardEntity card = UtilityCardEntity.builder().cardNo("1111").cvc("11").build();
            utilityCardRepository.save(card);

        };
    }
}
