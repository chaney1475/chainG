'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { dutyList } from '@/constants/dutyList'
import '@/styles/styles'
import { DayKey } from '@/types/duty'

import { WeekSelectorItem } from '../WeekSelectorItem'
import { Container } from './styles'

export function WeekSelector() {
  const { t } = useTranslation()
  const router = useRouter()

  const week: DayKey[] = [
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
      {week.map((item) => (
        <WeekSelectorItem
          key={item}
          day={item}
          date={1}
          duty={dutyList[item]}
        />
      ))}
    </Container>
  )
}
