'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import { BottomNavigation, TopHeader } from '@/components'
import { resetStore } from '@/store/store'
import { Container } from '@/styles/styles'

import { Account } from './component/Account'
import { Profile } from './component/Profile'
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
    <>
      <Container>
        <TopHeader title={t('my.title')} />
        <FullMain>
          <Profile />
          <Account handleLogout={handleLogout} />
        </FullMain>
        <BottomNavigation />
      </Container>
    </>
  )
}
