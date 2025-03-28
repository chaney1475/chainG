package com.ssafy.chaing.batch.config;

import com.ssafy.chaing.batch.service.RentBatchService;
import com.ssafy.chaing.payment.domain.PaymentEntity;
import com.ssafy.chaing.payment.domain.PaymentStatus;
import com.ssafy.chaing.payment.repository.PaymentRepository;
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
public class BatchConfig {

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
                List.of(PaymentStatus.STARTED, PaymentStatus.COLLECTED, PaymentStatus.PARTIALLY_PAID,
                        PaymentStatus.RETRY_PENDING)
        );

        for (PaymentEntity payment : pendingPayments) {
            ZonedDateTime collectExecution = payment.getNextExecutionDate().minusDays(1);
            ZonedDateTime ownerExecution = payment.getNextExecutionDate();

            // ✅ 14일 → 공동 계좌 모으기만 수행
            if (payment.getStatus() == PaymentStatus.STARTED) {
                taskScheduler.schedule(() -> rentBatchService.collectToJointAccount(payment.getId()),
                        collectExecution.toInstant());
            }

            // ✅ 15일 → 송금 수행 (PARTIALLY_PAID 상태 포함)
            taskScheduler.schedule(() -> rentBatchService.payToOwner(payment.getId()),
                    ownerExecution.toInstant());

            log.info("✅ 기존 배치 등록 완료 → Payment ID = {}, CollectExecution = {}, OwnerExecution = {}",
                    payment.getId(), collectExecution, ownerExecution);
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

            List<PaymentEntity> payments = paymentRepository.findByStatus(PaymentStatus.STARTED);
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

            List<PaymentEntity> payments = paymentRepository.findByStatus(PaymentStatus.COLLECTED);
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
