'use client'

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { getMySummary } from '@/apis/user'
import { ConfirmButton } from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setDutyWeekList } from '@/store/slices/dutySlice'
import { setSummary } from '@/store/slices/userSlice'
import { ButtonVariant } from '@/types/ui'

import {
  Container,
  ContentContainer,
  TextContainer,
  TitleTextContainer,
  TopContainer,
} from './styles'

interface AccountProps {
  handleLogout: () => void
}

export function Account({ handleLogout }: AccountProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const approve: ButtonVariant = 'next'

  const livingBudget = useAppSelector((state) => state.livingBudget)
  const contract = useAppSelector((state) => state.contract)

  console.log(livingBudget)

  // useEffect(() => {
  //   const fetchMySummary = async () => {
  //     try {
  //       const response = await getMySummary()
  //       if (response && 'data' in response) {
  //         dispatch(setSummary(response.data))
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch my summary:', error)
  //     }
  //   }
  //   fetchMySummary()
  // }, [dispatch])

  return (
    <Container>
      {/* <TopContainer>
        <TitleTextContainer>{t('my.account.title')}</TitleTextContainer>
        <ContentContainer>
          <TextContainer>
            <div>{t('my.account.myAccount')}</div>
            <div>{livingBudget.myAccountNo}</div>
          </TextContainer>
          <hr />
          <TextContainer>
            <div>{t('my.account.rentAccount')}</div>
            <div>{contract.contract.rent.rentAccountNo}</div>
          </TextContainer>
          <hr />

          <TextContainer>
            <div>{t('my.account.liveAccount')}</div>
            <div>{livingBudget.livingAccountNo}</div>
          </TextContainer>
          <hr />

          <TextContainer>
            <div>{t('my.account.ownerAccount')}</div>
            <div>{contract.contract.rent.ownerAccountNo}</div>
          </TextContainer>
        </ContentContainer>
      </TopContainer>

      <ConfirmButton
        label="로그아웃"
        onClick={handleLogout}
        variant={approve}
      /> */}
    </Container>
  )
}
