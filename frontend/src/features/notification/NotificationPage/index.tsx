'use client'

import React, { useEffect, useState } from 'react'

import { getNotifications } from '@/apis/notification'
import { NavLayout } from '@/components/layouts/NavLayout'
import { useAppSelector } from '@/hooks/useAppSelector'
import useFormattedTime from '@/hooks/useFormattedTime'
import { Notification } from '@/types/notification'

import {
  CategoryContainer,
  NotificationContent,
  NotificationDate,
  NotificationHeader,
  NotificationItem,
  NotificationTitle,
} from './styles'

const NotificationItemComponent = ({
  notification,
}: {
  notification: Notification
}) => {
  const formattedTime = useFormattedTime(new Date(notification.date).getTime())
  return (
    <NotificationItem>
      <CategoryContainer
        src="/images/notification/notification-etc.svg"
        alt="notification"
        width={40}
        height={40}
      />
      <div>
        <NotificationHeader>
          <NotificationTitle>{notification.title}</NotificationTitle>
          <NotificationDate>{formattedTime}</NotificationDate>
        </NotificationHeader>
        <NotificationContent>{notification.content}</NotificationContent>
      </div>
    </NotificationItem>
  )
}

export function NotificationPage() {
  const { user } = useAppSelector((state) => state.user)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!user.id) return
    const fetchNotification = async () => {
      const response = await getNotifications(user.id)
      if (response.success) {
        setNotifications(response.data)
      }
    }
    fetchNotification()
  }, [user.id])

  return (
    <NavLayout title="알림">
      {notifications.map((notification) => (
        <NotificationItemComponent
          key={notification.id}
          notification={notification}
        />
      ))}
    </NavLayout>
  )
}
