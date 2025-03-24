package com.ssafy.chaing.batch.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.chaing.blockchain.handler.rent.RentHandler;
import com.ssafy.chaing.blockchain.handler.rent.input.RentInput;
import com.ssafy.chaing.blockchain.handler.utility.UtilityHandler;
import com.ssafy.chaing.blockchain.handler.utility.input.UtilityInput;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@EnableBatchProcessing
@RequiredArgsConstructor
@Slf4j
public class BatchConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final RentHandler rentHandler;
    private final UtilityHandler utilityHandler;

    @Bean
    @Primary
    @Qualifier("rentAddContractJob")
    public Job rentAddContractJob(@Qualifier("rentAddContractStep") Step rentAddContractStep) {
        // JobBuilder를 사용하여 배치 작업(job)을 생성합니다.
        return new JobBuilder("rentAddContractJob", jobRepository)
                .start(rentAddContractStep)
                .build();
    }

    @Bean
    @Qualifier("utilityAddContractJob")
    public Job utilityAddContractJob(@Qualifier("utilityAddContractStep") Step utilityAddContractStep) {
        // JobBuilder를 사용하여 배치 작업(job)을 생성합니다.
        return new JobBuilder("utilityAddContractJob", jobRepository)
                .start(utilityAddContractStep)
                .build();
    }

    @Bean
    public Step rentAddContractStep(@Qualifier("rentAddContractTasklet") Tasklet rentAddContractTasklet) {
        return new StepBuilder("rentAddContractStep", jobRepository)
                .tasklet(rentAddContractTasklet, transactionManager)
                .build();
    }

    @Bean
    public Step utilityAddContractStep(@Qualifier("utilityAddContractTasklet") Tasklet utilityAddContractTasklet) {
        return new StepBuilder("utilityAddContractStep", jobRepository)
                .tasklet(utilityAddContractTasklet, transactionManager)
                .build();
    }

    // StepScope를 사용하여 JobParameter를 주입받습니다.
    @Bean
    @StepScope
    public Tasklet rentAddContractTasklet(
            @Value("#{jobParameters['rentInputJson']}") String rentInputJson
    ) {
        return (contribution, chunkContext) -> {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                // JSON 문자열을 RentInput 객체로 역직렬화
                RentInput rentInput = objectMapper.readValue(rentInputJson, RentInput.class);
                // rentHandler의 addContract 메서드를 호출하는 로직
//                String result = rentHandler.addContract(rentInput);
                String result = "success";
                log.info("add rent contract result: {}", result);
            } catch (JsonProcessingException e) {
                System.err.println("JSON 역직렬화 실패: " + e.getMessage());
                throw e;
            }
            return RepeatStatus.FINISHED;
        };
    }

    @Bean
    @StepScope
    public Tasklet utilityAddContractTasklet(
            @Value("#{jobParameters['utilityInputJson']}") String utilityInputJson
    ) {
        return (contribution, chunkContext) -> {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                // JSON 문자열을 RentInput 객체로 역직렬화
                UtilityInput utilityInput = objectMapper.readValue(utilityInputJson, UtilityInput.class);
                // rentHandler의 addContract 메서드를 호출하는 로직
//                String result = utilityHandler.addContract(utilityInput);
                String result = "success";
                log.info("add utility contract result: {}", result);
            } catch (JsonProcessingException e) {
                log.info("JSON 역직렬화 실패: {}", e.getMessage());
                throw e;
            }
            return RepeatStatus.FINISHED;
        };
    }

}
