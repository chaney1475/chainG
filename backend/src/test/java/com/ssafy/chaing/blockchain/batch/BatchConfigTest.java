package com.ssafy.chaing.blockchain.batch;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.chaing.batch.scheduler.RentBatchScheduler;
import com.ssafy.chaing.batch.scheduler.UtilityBatchScheduler;
import com.ssafy.chaing.blockchain.handler.rent.input.RentInput;
import com.ssafy.chaing.blockchain.handler.utility.input.UtilityInput;
import java.math.BigInteger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Qualifier;

public class BatchConfigTest {

    @Mock
    private JobLauncher jobLauncher;

    @Mock
    @Qualifier("rentAddContractJob")
    private Job rentAddContractJob;

    @Mock
    @Qualifier("utilityAddContractJob")
    private Job utilityAddContractJob;

    @InjectMocks
    private RentBatchScheduler rentBatchScheduler;

    @InjectMocks
    private UtilityBatchScheduler utilityBatchScheduler;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRunRentAddContractJob() throws Exception {
        // Act: 예약 실행 메서드를 수동으로 호출
        rentBatchScheduler.runRentAddContractJob();

        // Assert: jobLauncher.run 메서드가 rentAddContractJob과 함께 호출되었는지 확인
        ArgumentCaptor<JobParameters> jobParametersCaptor = ArgumentCaptor.forClass(JobParameters.class);
        verify(jobLauncher, times(1)).run(eq(rentAddContractJob), jobParametersCaptor.capture());

        JobParameters capturedParams = jobParametersCaptor.getValue();

        // rentInputJson 파라미터가 존재하는지 확인
        String rentInputJson = capturedParams.getString("rentInputJson");
        assertThat(rentInputJson).isNotNull();

        // 전달된 rentInputJson을 RentInput 객체로 파싱하여 내부 값 검증
        ObjectMapper objectMapper = new ObjectMapper();
        RentInput rentInput = objectMapper.readValue(rentInputJson, RentInput.class);
        assertThat(rentInput.getId()).isEqualTo(BigInteger.ONE);
        assertThat(rentInput.getAccountId()).isEqualTo(BigInteger.valueOf(2));
        assertThat(rentInput.getMonth()).isEqualTo(BigInteger.valueOf(3));
        assertThat(rentInput.getFrom()).isEqualTo("112233445566");
        assertThat(rentInput.getTo()).isEqualTo("665544332211");
        assertThat(rentInput.getAmount()).isEqualTo(BigInteger.valueOf(100000));
        assertThat(rentInput.getStatus()).isTrue();
        assertThat(rentInput.getTime()).isEqualTo("2025-03-20Z");

        // 매 실행마다 생성되는 'time' 파라미터도 존재하는지 확인 (null 이 아님)
        Long timeParam = capturedParams.getLong("time");
        assertThat(timeParam).isNotNull();
    }

    @Test
    public void testRunUtilityAddContractJob() throws Exception {
        // Act: 예약 실행 메서드를 수동으로 호출
        utilityBatchScheduler.runUtilityAddContractJob();

        // Assert: jobLauncher.run 메서드가 rentAddContractJob과 함께 호출되었는지 확인
        ArgumentCaptor<JobParameters> jobParametersCaptor = ArgumentCaptor.forClass(JobParameters.class);
        verify(jobLauncher, times(1)).run(eq(utilityAddContractJob), jobParametersCaptor.capture());

        JobParameters capturedParams = jobParametersCaptor.getValue();

        // utilityInputJson 파라미터가 존재하는지 확인
        String utilityInputJson = capturedParams.getString("utilityInputJson");
        assertThat(utilityInputJson).isNotNull();

        // 전달된 rentInputJson을 RentInput 객체로 파싱하여 내부 값 검증
        ObjectMapper objectMapper = new ObjectMapper();
        UtilityInput utilityInput = objectMapper.readValue(utilityInputJson, UtilityInput.class);
        assertThat(utilityInput.getId()).isEqualTo(BigInteger.ONE);
        assertThat(utilityInput.getAccountId()).isEqualTo(BigInteger.valueOf(2));
        assertThat(utilityInput.getMonth()).isEqualTo(BigInteger.valueOf(3));
        assertThat(utilityInput.getFrom()).isEqualTo("112233445566");
        assertThat(utilityInput.getTo()).isEqualTo("665544332211");
        assertThat(utilityInput.getAmount()).isEqualTo(BigInteger.valueOf(100000));
        assertThat(utilityInput.getStatus()).isTrue();
        assertThat(utilityInput.getTime()).isEqualTo("2025-03-20Z");

        // 매 실행마다 생성되는 'time' 파라미터도 존재하는지 확인 (null 이 아님)
        Long timeParam = capturedParams.getLong("time");
        assertThat(timeParam).isNotNull();
    }

}
