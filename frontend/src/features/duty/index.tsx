'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { TopHeader } from '@/components'
import { dutyWeekList } from '@/constants/duty'

import { DutyList } from './components/DutyList'
import { WeekList } from './components/WeekList'
import { Container, FullMain, Navigator } from './styles'

export function DutyPage() {
  const { t } = useTranslation()

  return (
    // test commint

    <Container>
      <TopHeader title={t('duty.title')} />
      <FullMain>
        <WeekList dutyList={dutyWeekList} />
        <DutyList dutyList={dutyWeekList} />
      </FullMain>
      <Navigator></Navigator>
    </Container>
  )
}
