'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

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

  console.log(user)

  const handleEdit = () => {
    router.push('/my/edit')
  }

  return (
    <Container>
      <TopContainer>
        <LeftContainer>
          <Image
            src={
              `/images/profile/${user.user.profileImage}.svg` ||
              '/images/profile/user1.png'
            }
            alt={user.user.name}
            width={60}
            height={60}
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
    </Container>
  )
}
