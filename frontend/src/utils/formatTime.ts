import { format, formatDistanceToNow, isThisMonth, parse } from 'date-fns'
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
export const formatHourMinuteTime = (time: string) => {
  const parsedTime = parse(time, "HH:mm'Z'", new Date())
  return format(parsedTime, 'HH:mm', { locale: ko })
}

export const formatDuration = (startDate: string, endDate: string) => {
  const newStartDate = parse(startDate, 'yyyyMMdd', new Date())
  const newEndDate = parse(endDate, 'yyyyMMdd', new Date())
  newEndDate.setDate(newEndDate.getDate() - 1)
  return `${format(newStartDate, 'PP', { locale: ko })} ~ ${format(newEndDate, 'PP', { locale: ko })}`
}
