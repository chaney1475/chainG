package com.ssafy.chaing.batch.config;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
public class ExecutionTime {
    private Integer hour;
    private Integer minute;
    private Integer dayOffset;
    private ZonedDateTime fixedTime;

    public ExecutionTime(ZonedDateTime fixedTime) {
        this.fixedTime = fixedTime;
        this.hour = null;
        this.minute = null;
        this.dayOffset = null;
    }

    public ExecutionTime(int hour, int minute, int dayOffset) {
        this.hour = hour;
        this.minute = minute;
        this.dayOffset = dayOffset;
    }

    public ZonedDateTime calculate(int baseDayOfMonth) {
        if (fixedTime != null) {
            return fixedTime;
        }

        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));

        // baseDate 초기화: 오늘 날짜의 baseDayOfMonth, 지정된 시간
        ZonedDateTime baseDate = now.withDayOfMonth(baseDayOfMonth)
                .withHour(hour).withMinute(minute).withSecond(0).withNano(0);

        // ✅ 오늘 baseDay이고, 아직 시간 안 지났으면 오늘
        if (now.toLocalDate().equals(baseDate.toLocalDate()) && now.isBefore(baseDate)) {
            return baseDate.plusDays(dayOffset);
        }

        // ✅ 오늘보다 이전 날짜거나, 오늘인데 시간 지났으면 → 다음 달
        if (now.isAfter(baseDate)) {
            baseDate = baseDate.plusMonths(1).withDayOfMonth(baseDayOfMonth);
        }

        return baseDate.plusDays(dayOffset);
    }

    public ZonedDateTime calculateFromNow() {
        if (fixedTime != null) {
            return fixedTime;
        }

        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
        return now
                .plusDays(dayOffset != null ? dayOffset : 0)
                .plusHours(hour != null ? hour : 0)
                .plusMinutes(minute != null ? minute : 0)
                .withSecond(0);
    }
}
