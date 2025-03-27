'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { useRouter } from 'next/navigation'

import { getFcmToken, onForegroundMessage } from '@/app/firebase'
import { IconButton } from '@/components/IconButton'
import { RootState } from '@/store/store'
import { Container, Main } from '@/styles/styles'

import { HomeLayout } from '../components/HomeLayout'
import { Page } from './styles'

export function HomePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const accessToken = useSelector(
    (state: RootState) => state.auth.loginToken.accessToken,
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    if (!accessToken) {
      router.push('/auth/login')
      return
    }

    const initFirebase = async () => {
      await getFcmToken()
      onForegroundMessage()
    }

    initFirebase()
  }, [accessToken, router, isMounted])

  if (!isMounted) {
    return null
  }

  if (!accessToken) {
    return (
      <Container>
        <Main>
          <h1>로고</h1>
          <p>캐치 프라이즈</p>
        </Main>
      </Container>
    )
  }

  return (
    <HomeLayout
      header="ChainG"
      headerRightButton={
        <IconButton
          src="/icons/notice-inactive.svg"
          alt={t('notice.title')}
        />
      }>
      <Main>
        <h1>ChainG 메인 페이지</h1>
        <p>홈이에요</p>
      </Main>
    </HomeLayout>
  )
}
