package com.ssafy.chaing.batch.scheduler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.chaing.blockchain.handler.rent.input.RentInput;
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
public class RentBatchScheduler {

    private final JobLauncher jobLauncher;
    private final Job rentAddContractJob;
    private final TaskScheduler taskScheduler;

    private Long dueDate;

    /**
     * 외부에서 해당 메서드를 호출하여 dueDate를 설정하고, 첫 예약을 진행합니다.
     * @param dueDate 사용자가 입력한 dueDate (예: 5)
     */
    public void initMonthlySchedule(Long dueDate) {
        if (dueDate == null || dueDate <= 1 || dueDate > 31) {
            throw new BadRequestException(ExceptionCode.INVALID_DUEDATE);
        }
        this.dueDate = dueDate;
        scheduleNextExecution();
    }

    /**
     * 다음 실행 시간을 계산하여 TaskScheduler로 배치 작업 예약을 진행합니다.
     */
    private void scheduleNextExecution() {
        Date nextExecutionTime = computeNextExecutionTime(dueDate);
        taskScheduler.schedule(this::executeAndReschedule, nextExecutionTime);
        log.info("다음 배치 작업이 {}에 예약되었습니다.", nextExecutionTime);
    }

    /**
     * 현재 작업을 실행한 후, 다음 예약을 진행하는 메서드
     */
    private void executeAndReschedule() {
        runRentAddContractJob();
        scheduleNextExecution();
    }

    /**
     * 사용자가 입력한 dueDate (예: 5)를 기준으로 매월 (dueDate - 1)일 오후 6시의 Date 객체를 반환합니다.
     * @param dueDate 사용자 입력 dueDate
     * @return 다음 실행 시간을 나타내는 Date 객체
     */
    private Date computeNextExecutionTime(Long dueDate) {
        ZoneId zoneId = ZoneId.of("Asia/Seoul");
        ZonedDateTime now = ZonedDateTime.now(zoneId);

        // 실행 날짜는 매월 (dueDate - 1)일
        int executionDay = (int) (dueDate - 1);

        // 현재 월의 실행 날짜로 시도
        YearMonth currentYearMonth = YearMonth.from(now);
        // 현재 월에 해당 실행일이 존재하는지 확인 (존재하지 않으면 해당 월의 마지막 날로 설정)
        int lastDayOfCurrentMonth = currentYearMonth.lengthOfMonth();
        if (executionDay > lastDayOfCurrentMonth) {
            executionDay = lastDayOfCurrentMonth;
        }
        LocalDate candidateDate = LocalDate.of(now.getYear(), now.getMonth(), executionDay);
        LocalDateTime candidateDateTime = candidateDate.atTime(18, 0);
        ZonedDateTime candidateZonedDateTime = candidateDateTime.atZone(zoneId);

        // 만약 후보 시간이 현재 시간보다 이전이거나 같으면 다음 달로 예약
        if (!candidateZonedDateTime.isAfter(now)) {
            ZonedDateTime nextMonth = now.plusMonths(1);
            YearMonth nextYearMonth = YearMonth.from(nextMonth);
            int lastDayOfNextMonth = nextYearMonth.lengthOfMonth();
            int nextExecutionDay = (int) (dueDate - 1);
            if (nextExecutionDay > lastDayOfNextMonth) {
                nextExecutionDay = lastDayOfNextMonth;
            }
            LocalDate nextCandidateDate = LocalDate.of(nextMonth.getYear(), nextMonth.getMonth(), nextExecutionDay);
            LocalDateTime nextCandidateDateTime = nextCandidateDate.atTime(18, 0);
            candidateZonedDateTime = nextCandidateDateTime.atZone(zoneId);
        }

        return Date.from(candidateZonedDateTime.toInstant());
    }

    /**
     * 배치 작업 실행 메서드
     */
    public void runRentAddContractJob() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // 예시 RentInput 객체 생성 (필요에 따라 실제 로직 구현)
            RentInput rentInput = new RentInput(
                    BigInteger.ONE,
                    BigInteger.valueOf(2),
                    BigInteger.valueOf(3),
                    "112233445566",
                    "665544332211",
                    BigInteger.valueOf(100000),
                    true,
                    "2025-03-20Z"
            );
            String rentInputJson = objectMapper.writeValueAsString(rentInput);
            JobParameters params = new JobParametersBuilder()
                    .addString("rentInputJson", rentInputJson)
                    .addLong("time", System.currentTimeMillis())
                    .toJobParameters();
            jobLauncher.run(rentAddContractJob, params);
            log.info("배치 작업이 실행되었습니다.");
        } catch (Exception e) {
            log.error("배치 작업 실행 중 오류 발생: {}", e.getMessage());
        }
    }

    /**
     * 매일 오후 6시(한국 시간 기준)에 실행하여
     * "내일 실행 대상"인 사용자를 조회하고 배치 작업 실행
     */
    @Scheduled(cron = "0 0 18 * * *", zone = "Asia/Seoul")
    public void runDailyBatch() {
        try {
            // 오늘 날짜 기준으로 실행 대상 사용자를 조회합니다.
            LocalDate today = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDate();
            // 납부일은 매월 dueDate인데, 실행은 납부일 - 1일이므로 오늘이 실행일인지 확인

            // ContractRepository에서 dueDate가 Today + 1인 Contract 조회
            // ContractEntity를 가지고 ContractUserEntity 가져오기
            // SSAFY 이체 API를 써서 이체 성공하면 컨트랙트로 올리기
            // 실패하면 실패한 내용 만들어서 올리기
            // 모두 이체가 끝나면 납부 여부에 따라서 Contract Status 값 설정.

            // 오늘이 납부일 이라면

            log.info("오늘 실행 대상 배치 작업이 완료되었습니다.");
        } catch (Exception e) {
            log.error("일별 배치 작업 실행 중 오류: {}", e.getMessage());
        }
    }

}
