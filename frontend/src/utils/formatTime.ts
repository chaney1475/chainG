import { format, formatDistanceToNow, isThisMonth } from 'date-fns'
import { ko } from 'date-fns/locale'

export const formatTime = (timestamp: number) => {
  const now = Date.now()
  const diffInHours = Math.floor((now - timestamp) / 3600000)
  const date = new Date(timestamp)

  if (diffInHours < 24) {
    return formatDistanceToNow(date, { addSuffix: true, locale: ko })
  }

  return isThisMonth(date)
    ? format(date, 'M월 d일', { locale: ko })
    : format(date, 'yyyy년 M월 d일', { locale: ko })
}
