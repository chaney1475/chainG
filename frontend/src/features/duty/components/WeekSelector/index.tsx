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

  const week: { name: string; day: DayKey }[] = [
    { name: '월', day: 'monday' },
    { name: '화', day: 'tuesday' },
    { name: '수', day: 'wednesday' },
    { name: '목', day: 'thursday' },
    { name: '금', day: 'friday' },
    { name: '토', day: 'saturday' },
    { name: '일', day: 'sunday' },
  ]

  return (
    <Container>
      {week.map((item) => (
        <WeekSelectorItem
          key={item.day}
          day={item.name}
          date={1}
          duty={dutyList[item.day]}
        />
      ))}
    </Container>
  )
}
