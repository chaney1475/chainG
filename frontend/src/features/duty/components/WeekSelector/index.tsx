'use client'

import React from 'react'

import { DayKey, DutyWeekList } from '@/types/duty'

import { WeekSelectorItem } from '../WeekSelectorItem'
import { Container } from './styles'

interface WeekSelectorProps {
  dutyList: DutyWeekList
}

export function WeekSelector({ dutyList }: WeekSelectorProps) {
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
