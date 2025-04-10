'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { ConfirmButton, Image } from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'

import {
  BottomContainer,
  ImageContainer,
  IntroduceBottomContainer,
  IntroduceContainer,
  LeftContainer,
  TopContainer,
} from './styles'
import { Container, TextContainer } from './styles'

export function Profile() {
  const { t } = useTranslation()
  const router = useRouter()
  const user = useAppSelector((state) => state.user)

  const handleEdit = () => {
    router.push('/my/edit')
  }

  return (
    <Container>
      <TopContainer>
        <LeftContainer>
          <Image
            src={`/images/profile/${user.user.profileImage}.svg`}
            alt={user.user.name}
            width={60}
            height={60}
            errorSrc={`/images/profile/user${user.user.id % 9}.svg`}
          />
          <IntroduceContainer>
            <div>{t('my.profile.group')}</div>
            <IntroduceBottomContainer>
              <div>{user.user.nickname}</div>
              <div>{t('my.profile.introduce')}</div>
            </IntroduceBottomContainer>
          </IntroduceContainer>
        </LeftContainer>
        <ImageContainer onClick={handleEdit}>
          <Image
            src="/icons/arrow-right.svg"
            alt="edit"
            width={24}
            height={24}
          />
        </ImageContainer>
      </TopContainer>
      <BottomContainer>
        <TextContainer>
          <div>{t('my.profile.name')}</div>
          {user?.user?.name && <div>{user.user.name}</div>}
        </TextContainer>
        <TextContainer>
          <div>{t('my.profile.email')}</div>
          {user?.summary?.emailAddress && (
            <div>{user.summary.emailAddress}</div>
          )}
        </TextContainer>
      </BottomContainer>
      <ConfirmButton
        onClick={() => {
          router.push('/blockChain')
        }}
        label="블록체인 가이드 바로가기"
        variant="slimPrev"
      />
    </Container>
  )
}
