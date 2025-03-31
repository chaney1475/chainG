'use client'

import React from 'react'

import { DutyWeekList } from '@/types/duty'

import { DutyListItem } from '../DutyListItem'
import { Container } from './styles'

interface DutyListProps {
  dutyList: DutyWeekList
}

export function DutyList({ dutyList }: DutyListProps) {
  return (
    <Container>
      {dutyList.monday.map((duty) => (
        <DutyListItem
          key={duty.id}
          duty={duty}
        />
      ))}
    </Container>
  )
}
