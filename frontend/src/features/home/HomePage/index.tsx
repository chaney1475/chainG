'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { IconButton } from '@/components/IconButton'
import { useAppSelector } from '@/hooks/useAppSelector'
import { Container, Main } from '@/styles/styles'

import { HomeLayout } from '../components/HomeLayout'

export function HomePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const accessToken = useAppSelector(
    (state) => state.auth.loginToken.accessToken,
  )
  const user = useAppSelector((state) => state.user.user)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    console.log('user', user)
    if (!user.id) return
    if (!user.groupId) {
      router.push('/onboarding')
    }
  }, [user, router])

  useEffect(() => {
    if (!isMounted) return

    if (!accessToken) {
      router.push('/auth/login')
      return
    }
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
      <h1>ChainG 메인 페이지</h1>
      <p>홈이에요</p>
      <p>id: {user.id}</p>
      <p>name: {user.name}</p>
      <p>nickname: {user.nickname}</p>
      <p>profileImage: {user.profileImage}</p>
      <p>groupId: {user.groupId}</p>
      <p>contractId: {user.contractId}</p>

      <h1>ChainG 메인 페이지</h1>
      <p>홈이에요</p>
      <p>id: {user.id}</p>
      <p>name: {user.name}</p>
      <p>nickname: {user.nickname}</p>
      <p>profileImage: {user.profileImage}</p>
      <p>groupId: {user.groupId}</p>
      <p>contractId: {user.contractId}</p>
    </HomeLayout>
  )
}
