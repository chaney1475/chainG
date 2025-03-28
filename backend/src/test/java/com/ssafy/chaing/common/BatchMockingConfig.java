package com.ssafy.chaing.common;

import static org.mockito.Mockito.mock;

import com.ssafy.chaing.fintech.service.FintechService;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.scheduling.TaskScheduler;

@TestConfiguration
public class BatchMockingConfig {

    @Primary
    @Bean
    public FintechService fintechService() {
        return mock(FintechService.class); // Mockito.mock
    }

    @Primary
    @Bean
    public TaskScheduler taskScheduler() {
        return mock(TaskScheduler.class);
    }
}
