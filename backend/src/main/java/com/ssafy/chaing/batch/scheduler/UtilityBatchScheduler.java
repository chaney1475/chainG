package com.ssafy.chaing.batch.scheduler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.chaing.blockchain.handler.rent.input.RentInput;
import com.ssafy.chaing.blockchain.handler.utility.input.UtilityInput;
import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class UtilityBatchScheduler {

    private final JobLauncher jobLauncher;
    private final Job utilityAddContractJob;
    private final TaskScheduler taskScheduler;

    private Long dueDate;

    // Cron 표현식: "0 0 18 ? * THU", zone을 "Asia/Seoul"로 지정
    @Scheduled(cron = "0 0 18 ? * THU", zone = "Asia/Seoul")
    public void runUtilityAddContractJob() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // Test용 RentInput 객체  생성
            // 추후 실제 자동이체가 이루어진 뒤 값을 받아와서 생성할 예정
            UtilityInput utilityInput = new UtilityInput(
                    BigInteger.ONE,
                    BigInteger.valueOf(2),
                    BigInteger.valueOf(3),
                    "112233445566",
                    "665544332211",
                    BigInteger.valueOf(100000),
                    true,
                    "2025-03-20Z"
            );

            String utilityInputJson = objectMapper.writeValueAsString(utilityInput);

            // 매 실행마다 고유한 JobParameter를 생성하여 중복 실행을 방지합니다.
            JobParameters params = new JobParametersBuilder()
                    .addString("utilityInputJson", utilityInputJson)
                    .addLong("time", System.currentTimeMillis())
                    .toJobParameters();
            jobLauncher.run(utilityAddContractJob, params);
            log.info("매주 목요일 오후 6시(한국 시간)에 배치 작업이 실행되었습니다.");
        } catch (Exception e) {
            log.info("배치 작업 실행 중 문제 발생: {}", e.getMessage());
        }
    }

}
