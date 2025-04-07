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
  const rentInfo = useAppSelector((state) => state.pledge.rent)
  const contractInfo = useAppSelector((state) => state.contract.contract)
  const groupSize = useAppSelector((state) => state.group.group.members.length)

  const month = Number(rentInfo?.monthList[0].month.slice(5))
  const userId = useAppSelector((state) => state.user.user.id)
  const date = new Date().getDate()
  const dutDate = rentInfo?.dueDate || 0
  const status = rentInfo?.currentMonth.find(
    (item) => item.userId === userId,
  )?.status

  let finalStatus: BudgetStatus = 'expected'
  if (date < dutDate) {
    finalStatus = 'expected'
  } else if (date === dutDate) {
    finalStatus = status ? 'complete' : 'expected'
  } else if (date > dutDate) {
    finalStatus = status ? 'complete' : 'debt'
  }

  return (
    <>
      <BoxContainer>
        <ContentContainer>
          <TopDescription>월세 - {month}월 정산내역</TopDescription>
          <TextContainer>
            <TextBox>
              <LowColorText>월세</LowColorText>
              <LowColorText>{rentInfo?.totalAmount}원</LowColorText>
            </TextBox>
            <hr />
            <TextBox>
              <DisabledColorText>참여 인원</DisabledColorText>
              <DisabledColorText>{groupSize} 명</DisabledColorText>
            </TextBox>
            <TextBox>
              <DisabledColorText>분담 비율</DisabledColorText>
              <DisabledColorText>
                {
                  contractInfo?.rent.userPaymentInfo.find(
                    (member) => member.userId === userId,
                  )?.ratio
                }{' '}
                / {contractInfo?.rent.totalRatio}
              </DisabledColorText>
            </TextBox>
            <TextBox>
              <LowColorText>내가 낼 월세</LowColorText>
              <LowColorText>{rentInfo?.myAmount}원</LowColorText>
            </TextBox>
            <hr />
            <TextBox>
              <DisabledColorText>자동이체 일</DisabledColorText>
              <DisabledColorText>매월 {dutDate}일</DisabledColorText>
            </TextBox>
            <TextBox>
              <LowColorText>월세 납부 여부</LowColorText>
              <StatusContainer>
                <StatusIcon variant={finalStatus} />
                <LowColorText>{t(`pledge.status.${finalStatus}`)}</LowColorText>
              </StatusContainer>
            </TextBox>
          </TextContainer>
        </ContentContainer>
      </BoxContainer>
    </>
  )
}
