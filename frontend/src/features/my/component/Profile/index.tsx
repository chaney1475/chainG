'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

import Image from 'next/image'

import { IconButton } from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
import { User } from '@/types/user'

import {
  BottomContainer,
  IntroduceBottomContainer,
  IntroduceContainer,
  LeftContainer,
  TopContainer,
} from './styles'
import { Container, TextContainer } from './styles'

export function Profile() {
  const { t } = useTranslation()

  // const user: User = {
  //   id: 1,
  //   name: '김이름',
  //   nickname: '닉네임',
  //   profileImage: 'user1',
  // }

  // const user = useAppSelector((state) => state.user)
  // console.log(user)

  return (
    <Container>
      {/* <TopContainer>
        <LeftContainer>
          <Image
            src={
              `/images/profile/${user.user.profileImage}.png` ||
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
        <Image
          src="/icons/arrow-right.svg"
          alt="edit"
          width={24}
          height={24}
        />
      </TopContainer>
      <BottomContainer>
        <TextContainer>
          <div>{t('my.profile.name')}</div>
          <div>{user.user.name}</div>
        </TextContainer>
        <TextContainer>
          <div>{t('my.profile.email')}</div>
          <div>{user.summary.emailAddress}</div>
        </TextContainer>
      </BottomContainer> */}
    </Container>
  )
}
