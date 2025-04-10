'use client'

import React from 'react'

import { useRouter } from 'next/navigation'

import { ConfirmButton } from '@/components'
import { Image } from '@/components'
import {
  Description,
  EmptyContainer,
  PaddingContainer,
  Title,
  TitleContainer,
} from '@/styles/styles'
import { DayKey, Duty, DutyWeekList } from '@/types/duty'
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
  const router = useRouter()
  return (
    <Container>
      {dutyList[selectedWeek].length > 0 &&
        dutyList[selectedWeek].map((duty) => (
          <DutyListItem
            key={duty.id}
            duty={duty}
            userList={userList}
            onSelectDuty={onSelectDuty}
          />
        ))}
      {dutyList[selectedWeek].length == 0 && (
        <PaddingContainer>
          <EmptyContainer>
            <TitleContainer>
              <Title>당번이 없습니다</Title>
            </TitleContainer>
            <Description>친구들과 대화를 통해 당번을 만들어보세요!</Description>
          </EmptyContainer>
        </PaddingContainer>
      )}
    </Container>
  )
}
