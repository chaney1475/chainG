package com.ssafy.chaing.duty.service;

import com.ssafy.chaing.duty.domain.DutyAssigneeEntity;
import com.ssafy.chaing.duty.domain.DutyEntity;
import com.ssafy.chaing.duty.repository.DutyRepository;
import com.ssafy.chaing.notification.domain.NotificationCategory;
import com.ssafy.chaing.notification.service.NotificationService;
import com.ssafy.chaing.user.domain.UserEntity;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class DutyNotificationService {

    private final DutyRepository dutyRepository;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 0 * * * *") // 매 정각마다 (UTC 기준)
    @Transactional
    public void checkAndSendDutyNotifications() {
        ZonedDateTime nowUtc = ZonedDateTime.now(ZoneOffset.UTC);
        ZonedDateTime kstNow = nowUtc.withZoneSameInstant(ZoneId.of("Asia/Seoul"));
        String todayDayOfWeek = kstNow.getDayOfWeek().toString(); // 예: "MONDAY"
        String yesterdayDayOfWeek = kstNow.minusDays(1).getDayOfWeek().toString(); // 전날 요일

        log.info("📌 현재 시간(KST): {}, 요일: {}", kstNow.toLocalTime(), todayDayOfWeek);

        // ✅ 1. useTime == true인 경우 (기존 방식)
        ZonedDateTime utcPlusOne = nowUtc.plusHours(1);
        ZonedDateTime kstOneHourLater = utcPlusOne.withZoneSameInstant(ZoneId.of("Asia/Seoul"));
        String dutyTimeString = kstOneHourLater.toLocalTime().truncatedTo(ChronoUnit.MINUTES).toString() + "Z";

        List<DutyEntity> timedDuties = dutyRepository.findWithAssigneesAndUsersByDutyTimeRaw(dutyTimeString);
        for (DutyEntity duty : timedDuties) {
            if (!duty.isUseTime()) {
                continue;
            }
            if (!duty.getDayOfWeek().equalsIgnoreCase(todayDayOfWeek)) {
                continue;
            }
            sendDutyNotificationToAllAssignees(duty, "[당번 알림] " + duty.getTitle(),
                    "1시간 후 \"" + duty.getTitle() + "\" 예정되어 있습니다.");
        }

        // ✅ 2. useTime == false인 경우 (종일 duty → 전날 23시, 당일 08시)
        int hour = kstNow.getHour();
        boolean isNoticeTime = (hour == 8 || hour == 23);

        if (isNoticeTime) {
            String targetDay = (hour == 23) ? kstNow.plusDays(1).getDayOfWeek().toString() : todayDayOfWeek;
            List<DutyEntity> allDuties = dutyRepository.findAllWithAssigneesAndUsers(); // fetch join all
            for (DutyEntity duty : allDuties) {
                if (duty.isUseTime()) {
                    continue;
                }
                if (!duty.getDayOfWeek().equalsIgnoreCase(targetDay)) {
                    continue;
                }

                String timeNotice = (hour == 23) ? "내일 예정된" : "오늘 예정된";
                String title = "[당번 알림] " + duty.getTitle();
                String content = timeNotice + " \"" + duty.getTitle() + "\" 당번이 있습니다.";
                sendDutyNotificationToAllAssignees(duty, title, content);
            }
        }
    }

    private void sendDutyNotificationToAllAssignees(DutyEntity duty, String title, String content) {
        for (DutyAssigneeEntity assignee : duty.getAssignees()) {
            UserEntity user = assignee.getGroupUser().getUser();
            if (user.getFcmToken() != null && !user.getFcmToken().isBlank()) {
                notificationService.sendNotification(
                        user.getId(),
                        title,
                        content,
                        NotificationCategory.DUTY
                );
                log.info("📨 알림 전송: userId={}, title={}", user.getId(), title);
            } else {
                log.warn("⚠️ FCM 토큰 없음 - userId={}", user.getId());
            }
        }
    }

    @Transactional
    public void processDutyNotificationAt(ZonedDateTime nowUtc) {
        ZonedDateTime kstNow = nowUtc.withZoneSameInstant(ZoneId.of("Asia/Seoul"));
        String todayDayOfWeek = kstNow.getDayOfWeek().toString();

        log.info("📌 [테스트용] 현재 시간(KST): {}, 요일: {}", kstNow.toLocalTime(), todayDayOfWeek);

        // 1시간 뒤 duty 알림 처리
        ZonedDateTime utcPlusOne = nowUtc.plusHours(1);
        ZonedDateTime kstOneHourLater = utcPlusOne.withZoneSameInstant(ZoneId.of("Asia/Seoul"));
        String dutyTimeString = kstOneHourLater.toLocalTime().truncatedTo(ChronoUnit.MINUTES).toString() + "Z";

        List<DutyEntity> timedDuties = dutyRepository.findWithAssigneesAndUsersByDutyTimeRaw(dutyTimeString);
        for (DutyEntity duty : timedDuties) {
            if (!duty.isUseTime()) {
                continue;
            }
            if (!duty.getDayOfWeek().equalsIgnoreCase(todayDayOfWeek)) {
                continue;
            }

            sendDutyNotificationToAllAssignees(duty,
                    "[당번 알림] " + duty.getTitle(),
                    "1시간 후 \"" + duty.getTitle() + "\" 예정되어 있습니다.");
        }

        // 종일 duty: 전날 23시 또는 당일 08시
        int hour = kstNow.getHour();
        if (hour == 8 || hour == 23) {
            List<DutyEntity> allDuties = dutyRepository.findAllWithAssigneesAndUsers();
            for (DutyEntity duty : allDuties) {
                if (duty.isUseTime()) {
                    continue;
                }
                if (!duty.getDayOfWeek().equalsIgnoreCase(todayDayOfWeek)) {
                    continue;
                }

                String timeNotice = (hour == 23) ? "내일 예정된" : "오늘 예정된";
                String title = "[당번 알림] " + duty.getTitle();
                String content = timeNotice + " \"" + duty.getTitle() + "\" 당번이 있습니다.";

                sendDutyNotificationToAllAssignees(duty, title, content);
            }
        }
    }
}
