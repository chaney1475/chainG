'use client'

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

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
  const approve: ButtonVariant = 'next'

  const livingBudget = useAppSelector((state) => state.livingBudget)
  const contract = useAppSelector((state) => state.contract)

  console.log(livingBudget)

  useEffect(() => {
    const getMySummary = async () => {
      const response = await getMySummary()
      console.log(response)
      if (response.success) {
        console.log('듀티 리스트', response.data)
        dispatch(setSummary(response.data))
      }
    }
    getMySummary()
  }, [])

  return (
    <Container>
      <TopContainer>
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
      />
    </Container>
  )
}
