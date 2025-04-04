'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

import { ConfirmButton } from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
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
