'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import { logout } from '@/apis/auth'
import { BottomNavigation, TopHeader } from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
import { resetStore } from '@/store/store'
import { Container } from '@/styles/styles'

import { Account } from './component/Account'
import { Profile } from './component/Profile'
import { FullMain } from './styles'

export function MyPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()
  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      dispatch(resetStore())
      router.push('/auth/login')
    }
  }

  const user = useAppSelector((state) => state.user)

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
