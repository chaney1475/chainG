'use client'

import React from 'react'

import { DayKey, DutyWeekList, Duty } from '@/types/duty'
import { User } from '@/types/user'

import { DutyListItem } from '../DutyListItem'
import { Container } from './styles'

interface DutyListProps {
  dutyList: DutyWeekList
  selectedWeek: DayKey
  userList: User[]
  onSelectDuty: (duty: Duty) => void
}

export function DutyList({
  dutyList,
  selectedWeek,
  userList,
  onSelectDuty,
}: DutyListProps) {
  return (
    <Container>
      {dutyList[selectedWeek].map((duty) => (
        <DutyListItem
          key={duty.id}
          duty={duty}
          userList={userList}
          onSelectDuty={onSelectDuty}
        />
      ))}
    </Container>
  )
}
