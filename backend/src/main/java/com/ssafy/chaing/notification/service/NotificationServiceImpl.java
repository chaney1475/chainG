package com.ssafy.chaing.notification.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import com.ssafy.chaing.notification.domain.NotificationEntity;
import com.ssafy.chaing.notification.repository.NotificationRepository;
import com.ssafy.chaing.notification.service.command.NotificationCommand;
import com.ssafy.chaing.notification.service.command.ReadNotificationCommand;
import com.ssafy.chaing.notification.service.dto.NotificationDTO;
import com.ssafy.chaing.notification.service.dto.UnreadNotificationDTO;
import com.ssafy.chaing.user.domain.UserEntity;
import com.ssafy.chaing.user.repository.UserRepository;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Service
public class NotificationServiceImpl implements NotificationService {

    private final FirebaseMessaging firebaseMessaging;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void publishNotification(NotificationCommand command) {

        UserEntity user = userRepository.findById(command.getUserId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));

        NotificationEntity notification = NotificationEntity.builder()
                .user(user)
                .title(command.getTitle())
                .content(command.getContent())
                .isRead(false)
                .createdAt(ZonedDateTime.now())
                .category(command.getCategory())
                .build();

        NotificationEntity saved = notificationRepository.save(notification);

        System.out.println("saved = " + NotificationDTO.from(saved));

        sendNotificationAsync(user.getFcmToken(), command.getTitle(), command.getContent());
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDTO> getNotifications(Long userId) {

        List<NotificationEntity> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return list.stream().map(NotificationDTO::from).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UnreadNotificationDTO getUnreadCount(Long userId) {

        long count = notificationRepository.countByUserIdAndReadFalse(userId);

        return new UnreadNotificationDTO(count);
    }

    @Override
    @Transactional
    public void markAsRead(ReadNotificationCommand command) {
        if (command.getNotificationIds() == null || command.getNotificationIds().isEmpty()) {
            return;
        }

        int updatedCount = notificationRepository.markAsReadByIds(
                command.getUserId(),
                command.getNotificationIds()
        );

    }

    private void sendNotificationAsync(String token, String title, String content) {
        CompletableFuture.runAsync(() -> {
            try {
                Message message = Message.builder()
                        .setToken(token)
                        .setNotification(Notification.builder()
                                .setTitle(title)
                                .setBody(content)
                                .build())
                        .build();

                String response = firebaseMessaging.send(message);
                log.info("FCM 발송 성공 - response: {}", response);

            } catch (Exception e) {
                log.error("FCM 발송 실패 - {}", e.getMessage(), e);
            }
        }).orTimeout(5, TimeUnit.SECONDS); // 5초 타임아웃 설정
    }
}
