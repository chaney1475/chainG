package com.ssafy.chaing.duty.service;

import com.ssafy.chaing.duty.domain.DutyAssigneeEntity;
import com.ssafy.chaing.duty.domain.DutyEntity;
import com.ssafy.chaing.duty.repository.DutyRepository;
import com.ssafy.chaing.group.domain.GroupUserEntity;
import com.ssafy.chaing.notification.domain.NotificationCategory;
import com.ssafy.chaing.notification.service.NotificationService;
import com.ssafy.chaing.user.domain.UserEntity;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DutyNotificationServiceTest {

    @Mock
    private DutyRepository dutyRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private DutyNotificationService dutyNotificationService;

    @Test
    void testFullDayDuty_At23PM_ShouldSendTomorrowAlert() {
        // KST 23:00 → UTC 14:00
        ZonedDateTime testUtc = ZonedDateTime.of(
                2024, 4, 1, 14, 0, 0, 0,
                ZoneOffset.UTC);
        String kstToday = testUtc.withZoneSameInstant(ZoneId.of("Asia/Seoul"))
                .getDayOfWeek().toString(); // MONDAY

        DutyEntity duty = createFullDayDuty(kstToday, false, "00:00Z");
        Mockito.when(dutyRepository.findAllWithAssigneesAndUsers()).thenReturn(List.of(duty));

        dutyNotificationService.processDutyNotificationAt(testUtc);

        Mockito.verify(notificationService).sendNotification(
                Mockito.eq(123L),
                Mockito.anyString(),
                Mockito.contains("내일 예정된"),
                Mockito.eq(NotificationCategory.DUTY)
        );
    }

    @Test
    void testFullDayDuty_At8AM_ShouldSendTodayAlert() {
        // KST 08:00 → UTC 23:00 (전날)
        ZonedDateTime testUtc = ZonedDateTime.of(2024, 4, 1, 23, 0, 0, 0, ZoneOffset.UTC);
        String kstToday = testUtc.withZoneSameInstant(ZoneId.of("Asia/Seoul"))
                .getDayOfWeek().toString(); // TUESDAY

        DutyEntity duty = createFullDayDuty(kstToday, false, "00:00Z");
        Mockito.when(dutyRepository.findAllWithAssigneesAndUsers()).thenReturn(List.of(duty));

        dutyNotificationService.processDutyNotificationAt(testUtc);

        Mockito.verify(notificationService).sendNotification(
                Mockito.eq(123L),
                Mockito.anyString(),
                Mockito.contains("오늘 예정된"),
                Mockito.eq(NotificationCategory.DUTY)
        );
    }

    @Test
    void testTimedDuty_OneHourBefore_ShouldSendOneHourNotice() {
        // KST 13:00 → UTC 4:00
        ZonedDateTime testUtc = ZonedDateTime.of(2024, 4, 2, 4, 0, 0, 0, ZoneOffset.UTC);
        String dutyTimeRaw = "14:00Z";

        DutyEntity duty = createFullDayDuty("TUESDAY", true, dutyTimeRaw); // 👈 여기서 넣어줌

        Mockito.when(dutyRepository.findWithAssigneesAndUsersByDutyTimeRaw(dutyTimeRaw))
                .thenReturn(List.of(duty));

        dutyNotificationService.processDutyNotificationAt(testUtc);

        Mockito.verify(notificationService).sendNotification(
                Mockito.eq(123L),
                Mockito.anyString(),
                Mockito.contains("1시간 후"),
                Mockito.eq(NotificationCategory.DUTY)
        );
    }

    // 🔽 Helper 메서드
    private DutyEntity createFullDayDuty(String dayOfWeek, boolean useTime, String dutyTimeRaw) {
        UserEntity user = UserEntity.builder()
                .id(123L)
                .fcmToken("dummy")
                .name("홍길동")
                .build();

        GroupUserEntity groupUser = GroupUserEntity.builder()
                .user(user)
                .build();

        DutyAssigneeEntity assignee = DutyAssigneeEntity.builder()
                .groupUser(groupUser)
                .build();

        return DutyEntity.builder()
                .id(1L)
                .title("청소")
                .dayOfWeek(dayOfWeek)
                .useTime(useTime)
                .dutyTimeRaw(dutyTimeRaw) // 무시되거나 비교용
                .assignees(Set.of(assignee))
                .build();
    }
}