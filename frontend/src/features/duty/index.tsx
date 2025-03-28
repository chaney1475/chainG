'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { TopHeader } from '@/components'
import { Container } from '@/styles/styles'

import { DutyList } from './components/DutyList'
import { WeekSelector } from './components/WeekSelector'
import { FullMain, Navigator } from './styles'

export function DutyPage() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Container>
      <TopHeader title={t('duty.title')} />
      <FullMain>
        <WeekSelector />
        <DutyList />
      </FullMain>
      <Navigator></Navigator>
    </Container>
  )
}
