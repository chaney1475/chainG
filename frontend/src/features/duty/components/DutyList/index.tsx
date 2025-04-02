'use client'

import React from 'react'

import { DayKey, DutyWeekList } from '@/types/duty'

import { DutyListItem } from '../DutyListItem'
import { Container } from './styles'

interface DutyListProps {
  dutyList: DutyWeekList
  selectedWeek: DayKey
}

export function DutyList({ dutyList, selectedWeek }: DutyListProps) {
  return (
    <Container>
      {dutyList[selectedWeek].map((duty) => (
        <DutyListItem
          key={duty.id}
          duty={duty}
        />
      ))}
    </Container>
  )
}
