'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import { Image } from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'

import { BoxContainer } from '../../../styles'
import {
  AmountContainer,
  ContentContainer,
  Periond,
  TextContainer,
  TopDescription,
} from './styles'

export function Payment() {
  const utilityInfo = useAppSelector((state) => state.pledge.utility)

  const year = new Date().getFullYear()
  const month = Number(
    utilityInfo?.weekList[0]?.month?.slice(5) ?? new Date().getMonth() + 1,
  )
  const weekOfMonth = Number(utilityInfo?.weekList[0]?.week ?? 1)

  // 해당 월의 첫날
  const firstDayOfMonth = new Date(year, month - 1, 1)

  // 해당 월의 첫 번째 월요일 찾기
  // 0: 일요일, 1: 월요일, ..., 6: 토요일
  const firstMonday = new Date(firstDayOfMonth)
  const firstDayOfWeek = firstDayOfMonth.getDay() // 해당 월의 첫날의 요일

  if (firstDayOfWeek === 0) {
    // 일요일인 경우
    firstMonday.setDate(firstDayOfMonth.getDate() + 1) // 다음날(월요일)
  } else if (firstDayOfWeek !== 1) {
    // 월요일이 아닌 경우
    // 이전 월의 마지막 월요일로 설정
    firstMonday.setDate(firstDayOfMonth.getDate() - (firstDayOfWeek - 1))
  }

  // 원하는 주차의 월요일 계산 (첫 번째 월요일 + (주차 - 1) * 7일)
  const mondayOfTargetWeek = new Date(firstMonday)
  mondayOfTargetWeek.setDate(firstMonday.getDate() + (weekOfMonth - 1) * 7)

  // 해당 주의 일요일 계산 (월요일 + 6일)
  const sundayOfTargetWeek = new Date(mondayOfTargetWeek)
  sundayOfTargetWeek.setDate(mondayOfTargetWeek.getDate() + 6)

  return (
    <>
      <BoxContainer>
        <ContentContainer>
          <TopDescription>
            공과금 - {month}월 {weekOfMonth}주차
          </TopDescription>
          <TextContainer>
            <AmountContainer>
              <Image
                src="/images/pledge/utilityCard.svg"
                alt="공과금"
                width={24}
                height={24}
              />
              <div>{utilityInfo?.totalAmount}</div>
            </AmountContainer>
            <Periond>
              {' '}
              {mondayOfTargetWeek.toLocaleDateString()} ~{' '}
              {sundayOfTargetWeek.toLocaleDateString()}{' '}
            </Periond>
          </TextContainer>
        </ContentContainer>
      </BoxContainer>
    </>
  )
}
