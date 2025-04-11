package com.ssafy.chaing.batch.config;

import static com.ssafy.chaing.payment.domain.PaymentStatus.COLLECTED;
import static com.ssafy.chaing.payment.domain.PaymentStatus.PARTIALLY_PAID;
import static com.ssafy.chaing.payment.domain.PaymentStatus.RETRY_PENDING;
import static com.ssafy.chaing.payment.domain.PaymentStatus.STARTED;

import com.ssafy.chaing.batch.service.RentBatchService;
import com.ssafy.chaing.payment.domain.PaymentEntity;
import com.ssafy.chaing.payment.repository.PaymentRepository;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@EnableBatchProcessing
@RequiredArgsConstructor
@Slf4j
public class RentBatchConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final RentBatchService rentBatchService;
    private final PaymentRepository paymentRepository;
    private final TaskScheduler taskScheduler;

    /**
     * ✅ 초기 설정 - 기존 계약서에 대해 배치 등록 → 서버 시작 시 실행 보장
     */
    public void registerExistingPayments() {

        // ✅ STARTED, COLLECTED, PARTIALLY_PAID, RETRY_PENDING 상태 모두 포함
        List<PaymentEntity> pendingPayments = paymentRepository.findByStatusIn(
                List.of(STARTED, COLLECTED, PARTIALLY_PAID,
                        RETRY_PENDING)
        );

        ZonedDateTime now = ZonedDateTime.now(ZoneOffset.UTC);

        // 실패한 작업은 오늘 올리기
        ZoneId zone = ZoneId.of("Asia/Seoul");
        ZonedDateTime nowKST = ZonedDateTime.now(zone);
        ZonedDateTime todaySixPM = nowKST.withHour(18).withMinute(0).withSecond(0).withNano(0);

        // 오늘 6시가 이미 지났으면 → 내일 6시로 설정
        ZonedDateTime retryExecution = nowKST.isAfter(todaySixPM)
                ? todaySixPM.plusDays(1)
                : todaySixPM;

        for (PaymentEntity payment : pendingPayments) {
            ZonedDateTime collectExecution = payment.getNextExecutionDate().minusDays(1);
            ZonedDateTime ownerExecution = payment.getNextExecutionDate();

            // 모으기 작업이 현재 시점보다 이전이면 올리기 -> 아직 실행되지 않은 모으기 taks가 서버가 껏다가 켜지면서 사라졋을 것
            if (collectExecution.isAfter(now)) {
                taskScheduler.schedule(() -> rentBatchService.collectToJointAccount(payment.getId()),
                        collectExecution.toInstant());
                log.info("📦 모으기 작업 등록됨: paymentId={}, 실행시간={}", payment.getId(), collectExecution);
            }
            // 전송하기 작업이 현재 시점보다 이전이면 올리기 -> 아직 실행되지 않은 집주인 이체 task가 서버가 껏다가 켜지면서 사라졋을 것
            if (ownerExecution.isAfter(now)) {
                taskScheduler.schedule(() -> rentBatchService.payToOwner(payment.getId()),
                        ownerExecution.toInstant());
                log.info("🏠 집주인 이체 작업 등록됨: paymentId={}, 실행시간={}", payment.getId(), ownerExecution);
            }

            // 위에 두개에 해당되지 않는 과거의 작업들은 아래의 작업을 탄다

            if (payment.getNextExecutionDate().isBefore(now) && List.of(COLLECTED, PARTIALLY_PAID, RETRY_PENDING)
                    .contains(payment.getStatus())
                    && payment.getRetryCount() <= 5) {

                taskScheduler.schedule(() -> rentBatchService.payToOwner(payment.getId()),
                        retryExecution.toInstant());

                log.info("🔁 과거 작업 재시도 등록됨: paymentId={}, 현재상태={}, 재시도시간={}",
                        payment.getId(), payment.getStatus(), retryExecution);
            }

        }
    }


    /**
     * ✅ 14일 배치 설정 → 공동 계좌로 송금 처리
     */
    @Bean
    public Step collectToJointAccountStep() {
        return new StepBuilder("collectToJointAccountStep", jobRepository)
                .tasklet(collectToJointAccountTasklet(), transactionManager)
                .build();
    }

    @Bean
    public Tasklet collectToJointAccountTasklet() {
        return (contribution, chunkContext) -> {
            log.info("💰 공동 계좌 송금 배치 시작");

            List<PaymentEntity> payments = paymentRepository.findByStatus(STARTED);
            for (PaymentEntity payment : payments) {
                rentBatchService.collectToJointAccount(payment.getId());
            }

            return org.springframework.batch.repeat.RepeatStatus.FINISHED;
        };
    }

    /**
     * ✅ 15일 배치 설정 → 집주인 송금 처리
     */
    @Bean
    public Step payToOwnerStep() {
        return new StepBuilder("payToOwnerStep", jobRepository)
                .tasklet(payToOwnerTasklet(), transactionManager)
                .build();
    }

    @Bean
    public Tasklet payToOwnerTasklet() {
        return (contribution, chunkContext) -> {
            log.info("💰 집주인 송금 배치 시작");

            List<PaymentEntity> payments = paymentRepository.findByStatus(COLLECTED);
            for (PaymentEntity payment : payments) {
                rentBatchService.payToOwner(payment.getId());
            }

            return org.springframework.batch.repeat.RepeatStatus.FINISHED;
        };
    }

    /**
     * ✅ Job 설정 - 14일 공동 계좌 송금 배치 + 15일 집주인 송금 배치 등록
     */
    @Bean
    public Job rentPaymentJob(Step collectToJointAccountStep, Step payToOwnerStep) {
        return new JobBuilder("rentPaymentJob", jobRepository)
                .start(collectToJointAccountStep)
                .next(payToOwnerStep)
                .build();
    }
}
