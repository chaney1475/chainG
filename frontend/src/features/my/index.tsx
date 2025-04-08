'use client'

import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import { logout } from '@/apis/auth'
import { getMySummary } from '@/apis/user'
import { BottomNavigation } from '@/components/BottomNavigation'
import { TopHeader } from '@/components/TopHeader'
import { setSummary } from '@/store/slices/userSlice'
import { resetStore } from '@/store/store'

import { Account, Profile } from './components'
import { Container, FullMain } from './styles'

export function MyPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    const fetchMySummary = async () => {
      try {
        const response = await getMySummary()
        if (response && 'data' in response) {
          dispatch(setSummary(response.data))
        }
      } catch (error) {
        console.error('Failed to fetch my summary:', error)
      }
    }
    fetchMySummary()
  }, [dispatch])

  const logouted = useRef(false)
  const handleLogout = async () => {
    if (logouted.current) return
    logouted.current = true
    const success = await logout()
    if (success) {
      router.push('/auth/login')
      dispatch(resetStore())
    }
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
