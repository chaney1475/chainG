'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import { BottomNavigation, TopHeader } from '@/components'
import { resetStore } from '@/store/store'
import { Container, HeaderContainer } from '@/styles/styles'

import { FullMain } from './styles'

export function MyPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()
  const handleLogout = () => {
    console.log('로그아웃')
    dispatch(resetStore())
    router.push('/auth/login')
  }
  return (
    <Container>
      <TopHeader title={t('my')} />
      <FullMain>
        <HeaderContainer onClick={handleLogout}>로그아웃</HeaderContainer>
      </FullMain>
      <BottomNavigation />
    </Container>
  )
}
