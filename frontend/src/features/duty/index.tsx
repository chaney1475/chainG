'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { TopHeader } from '@/components'

import { DutyList } from './components/DutyList'
import { WeekList } from './components/WeekList'
import { Container, FullMain, Navigator } from './styles'

export function DutyPage() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    // test commint

    <Container>
      <TopHeader title={t('duty.title')} />
      <FullMain>
        <WeekList />
        <DutyList />
      </FullMain>
      <Navigator></Navigator>
    </Container>
  )
}
