package com.ssafy.chaing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class ChaingApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChaingApplication.class, args);
    }

}
