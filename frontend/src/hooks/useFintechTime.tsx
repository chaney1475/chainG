import { useMemo } from 'react'

import { format, formatDistanceToNow, isThisMonth } from 'date-fns'
import { ko } from 'date-fns/locale'

/**
 * 날짜 관련 포맷팅 값들을 한 번에 제공하는 훅
 * @param date Date 객체
 * @param uniqueSuffix 고유번호 생성시 사용할 추가 6자리 숫자(선택사항)
 * @returns [transmissionDate, transmissionTime, institutionTransactionUniqueNo] 배열
 */
export const useFintechTime = (date: Date, uniqueSuffix?: string) => {
  return useMemo(() => {
    // YYYYMMDD 형식 날짜
    const formattedDate = formatTransmissionDate(date)

    // HHMMSS 형식 시간
    const formattedTime = formatTransmissionTime(date)

    // 거래 고유번호 (YYYYMMDDHHMMSSXXXXXX 형식)
    const uniqueNo = formatInstitutionTransactionUniqueNo(
      date,
      formattedDate,
      formattedTime,
      uniqueSuffix,
    )

    return [formattedDate, formattedTime, uniqueNo] as const
  }, [date, uniqueSuffix])
}

/**
 * 타임스탬프를 사람이 읽기 쉬운 형식으로 변환
 */
export const useReadableFintechTime = (timestamp: number) =>
  useMemo(() => formatReadableTime(timestamp), [timestamp])

const formatReadableTime = (timestamp: number) => {
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

/**
 * 날짜를 'YYYYMMDD' 형식으로 변환 (예: 20240405)
 */
const formatTransmissionDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}${month}${day}`
}

/**
 * 시간을 'HHMMSS' 형식으로 변환 (예: 154100)
 */
const formatTransmissionTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${hours}${minutes}${seconds}`
}

/**
 * 거래 고유번호 생성 (YYYYMMDDHHMMSSXXXXXX 형식)
 */
const formatInstitutionTransactionUniqueNo = (
  date: Date,
  formattedDate: string,
  formattedTime: string,
  uniqueSuffix?: string,
): string => {
  // 6자리 랜덤 숫자 생성 (uniqueSuffix가 제공되지 않은 경우)
  const suffix =
    uniqueSuffix ||
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0')

  return `${formattedDate}${formattedTime}${suffix}`
}
