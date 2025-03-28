'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import '@/styles/styles'
import { DayKey } from '@/types/duty'

import { WeekSelectorItem } from '../WeekSelectorItem'
import { Container, WeekSelectorItemContainer } from './styles'

export function WeekSelector() {
  const { t } = useTranslation()
  const router = useRouter()

  const days: DayKey[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]

  return (
    <Container>
      <div> {t(`duty.edit.week.title`)} </div>
      <WeekSelectorItemContainer>
        {days.map((day) => (
          <WeekSelectorItem
            key={day}
            day={day}
          />
        ))}
      </WeekSelectorItemContainer>
    </Container>
  )
}
