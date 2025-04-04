'use client'

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'


import { Container } from '@/styles/styles'

export function MyPage() {

  // useEffect(() => {
  //   const fetchMySummary = async () => {
  //     try {
  //       const response = await getMySummary()
  //       if (response && 'data' in response) {
  //         dispatch(setSummary(response.data))
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch my summary:', error)
  //     }
  //   }
  //   fetchMySummary()
  // }, [dispatch])

  // const handleLogout = async () => {
  //   const success = await logout()
  //   if (success) {
  //     dispatch(resetStore())
  //     router.push('/auth/login')
  //   }
  // }

  return (
    <>
      <Container>
        <div> 왜이래 </div>
        {/* <TopHeader title={t('my.title')} />
        <FullMain>
          <Profile />
          <Account handleLogout={handleLogout} />
        </FullMain>
        <BottomNavigation /> */}
      </Container>
    </>
  )
}
