package com.ssafy.chaing.notification.service.command;

import com.ssafy.chaing.notification.domain.NotificationCategory;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class NotificationCommand {
    private Long userId;
    private String title;
    private NotificationCategory category;
    private String content;
    private ZonedDateTime date;
}
