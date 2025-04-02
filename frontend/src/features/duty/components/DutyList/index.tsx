'use client'

import React from 'react'

import { DayKey, DutyWeekList } from '@/types/duty'
import { User } from '@/types/user'

import { DutyListItem } from '../DutyListItem'
import { Container } from './styles'

interface DutyListProps {
  dutyList: DutyWeekList
  selectedWeek: DayKey
  userList: User[]
}

export function DutyList({ dutyList, selectedWeek, userList }: DutyListProps) {
  return (
    <Container>
      {dutyList[selectedWeek].map((duty) => (
        <DutyListItem
          key={duty.id}
          duty={duty}
          userList={userList}
        />
      ))}
    </Container>
  )
}
