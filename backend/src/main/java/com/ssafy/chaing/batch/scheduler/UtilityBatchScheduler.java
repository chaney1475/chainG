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
    private final Job utilityBillingStatementJob;

    @Scheduled(cron = "0 0 9 * * MON", zone = "Asia/Seoul") // UTC 기준 월요일 0시 0분 0초
    public void runUtilityBillingJob() {
        try {
            // Job 실행 시 파라미터 전달 (동일 파라미터로 재실행 방지 및 실행 기록 구분용)
            JobParameters jobParameters = new JobParametersBuilder()
                    .addString("JobID", String.valueOf(System.currentTimeMillis())) // 현재 시간을 파라미터로 추가
                    .toJobParameters();

            log.info(">>> 스케줄러 실행: Utility Billing Job 시작. Params: {}", jobParameters);
            jobLauncher.run(utilityBillingStatementJob, jobParameters); // Job 실행
            log.info("<<< 스케줄러 실행: Utility Billing Job 완료.");

        } catch (Exception e) {
            log.error("!!! 스케줄러 실행 중 오류 발생: Utility Billing Job 실패", e);
        }
    }
}
