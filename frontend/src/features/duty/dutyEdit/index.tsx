'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { TopHeader } from '@/components'

import { TimeSelector } from './components/TimeSelector'
import { WeekSelector } from './components/WeekSelector'
import { Container, FullMain, Navigator } from './styles'

export function DutyEdit() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Container>
      <TopHeader title={t('duty.title')} />
      <FullMain>
        <WeekSelector />
        <TimeSelector />
      </FullMain>
      <Navigator></Navigator>
    </Container>
  )
}
