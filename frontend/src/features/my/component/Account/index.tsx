'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

import { ConfirmButton } from '@/components'
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
  const Account = '싸피 939-302-1423155'

  return (
    <Container>
      <TopContainer>
        <TitleTextContainer>{t('my.account.title')}</TitleTextContainer>
        <ContentContainer>
          <TextContainer>
            <div>{t('my.account.myAccount')}</div>
            <div>{Account}</div>
          </TextContainer>
          <hr />
          <TextContainer>
            <div>{t('my.account.rentAccount')}</div>
            <div>{Account}</div>
          </TextContainer>
          <hr />

          <TextContainer>
            <div>{t('my.account.liveAccount')}</div>
            <div>{Account}</div>
          </TextContainer>
          <hr />

          <TextContainer>
            <div>{t('my.account.ownerAccount')}</div>
            <div>{Account}</div>
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
