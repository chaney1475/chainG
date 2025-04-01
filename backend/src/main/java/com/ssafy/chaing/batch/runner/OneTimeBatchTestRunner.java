package com.ssafy.chaing.batch.runner; // 적절한 패키지 경로로 변경하세요

import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.TaskScheduler;

//@Component
@RequiredArgsConstructor
@Slf4j
public class OneTimeBatchTestRunner implements ApplicationListener<ApplicationReadyEvent> {

    private final JobLauncher jobLauncher;
    private final Job utilityBillingStatementJob; // Configuration에서 정의한 Job Bean
    private final TaskScheduler taskScheduler; // 지연 실행을 위한 TaskScheduler 주입
    private final Environment environment; // 현재 활성 프로파일 확인용 (선택적)

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        // "test" 프로파일이 아닐 때만 실행 (테스트 중 자동 실행 방지)
        if (!List.of(environment.getActiveProfiles()).contains("test")) {
            log.info("Application Ready! 10초 후에 utilityBillingStatementJob을 1회 실행합니다.");
            // 현재 시간 + 60초 후에 runJob 메서드 실행 예약
            taskScheduler.schedule(this::runJob, Instant.now().plusSeconds(10));
        } else {
            log.info("Test profile is active. Skipping automatic batch job run on startup.");
        }
    }

    private void runJob() {
        try {
            JobParameters jobParameters = new JobParametersBuilder()
                    .addLong("startTime", System.currentTimeMillis()) // 고유 파라미터 생성
                    .toJobParameters();
            log.info(">>> ApplicationReadyEvent로 유틸리티 배치 Job 실행 시작. Params: {}", jobParameters);
            jobLauncher.run(utilityBillingStatementJob, jobParameters);
            log.info("<<< ApplicationReadyEvent로 유틸리티 배치 Job 실행 완료.");
        } catch (Exception e) {
            log.error("!!! ApplicationReadyEvent로 유틸리티 배치 Job 실행 중 오류 발생", e);
        }
    }
}