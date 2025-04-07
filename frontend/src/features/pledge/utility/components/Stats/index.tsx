'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import { useAppSelector } from '@/hooks/useAppSelector'
import { BudgetStatus } from '@/types/budget'

import { BoxContainer } from '../../../styles'
import {
  ContentContainer,
  DisabledColorText,
  LowColorText,
  StatusContainer,
  StatusIcon,
  TextBox,
  TextContainer,
  TopDescription,
} from './styles'

export function Stats() {
  const { t } = useTranslation()
  const utilityInfo = useAppSelector((state) => state.pledge.utility)
  const groupSize = useAppSelector((state) => state.group.group.members.length)
  const userId = useAppSelector((state) => state.user.user.id)
  console.log('utilityInfo', utilityInfo)

  const month = Number(utilityInfo?.weekList[0].month.slice(5))
  const weekOfMonth = Number(utilityInfo?.weekList[0]?.week ?? 1)
  const date = new Date()
  const status = utilityInfo?.currentWeek.find(
    (item) => item.userId === userId,
  )?.status
  const dayOfWeek = date.getDay()

  function getStatus(
    dayOfWeek: number,
    status: boolean | undefined,
  ): BudgetStatus {
    if (dayOfWeek >= 1 && dayOfWeek <= 3) {
      return 'expected'
    }
    if (dayOfWeek === 4) {
      return status ? 'complete' : 'expected'
    }

    if (dayOfWeek === 6 || dayOfWeek === 5 || dayOfWeek === 0) {
      return status ? 'complete' : 'debt'
    }
    return 'expected'
  }

  return (
    <>
      <BoxContainer>
        <ContentContainer>
          <TopDescription>
            공과금 - {month}월 {weekOfMonth}주차 정산내역
          </TopDescription>
          <TextContainer>
            <TextBox>
              <LowColorText>공과금</LowColorText>
              <LowColorText>{utilityInfo?.totalAmount}원</LowColorText>
            </TextBox>
            <hr />
            <TextBox>
              <DisabledColorText>참여 인원</DisabledColorText>
              <DisabledColorText>{groupSize} 명</DisabledColorText>
            </TextBox>
            <TextBox>
              <DisabledColorText>분담 비율</DisabledColorText>
              <DisabledColorText> 1 / {groupSize}</DisabledColorText>
            </TextBox>
            <TextBox>
              <LowColorText>내가 낼 공과금</LowColorText>
              <LowColorText>{utilityInfo?.myAmount}원</LowColorText>
            </TextBox>
            <hr />
            <TextBox>
              <DisabledColorText>자동이체 일</DisabledColorText>
              <DisabledColorText>
                {t(`duty.week.${utilityInfo?.dueDayOfWeek}`)}요일
              </DisabledColorText>
            </TextBox>
            <TextBox>
              <LowColorText>공과금 납부 여부</LowColorText>
              <StatusContainer>
                <StatusIcon variant={getStatus(dayOfWeek, status)} />
                <LowColorText>
                  {t(`pledge.status.${getStatus(dayOfWeek, status)}`)}
                </LowColorText>
              </StatusContainer>
            </TextBox>
          </TextContainer>
        </ContentContainer>
      </BoxContainer>
    </>
  )
}
