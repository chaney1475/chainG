'use client'

import React from 'react'

import { useRouter } from 'next/navigation'

import { ConfirmButton } from '@/components'
import { Image } from '@/components'
import { EmptyContainer } from '@/components/AccountHistoryViewer/styles'
import {
  CenterContainer,
  DefaultContainer,
  Description,
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
            <Image
              src={'/images/lifeRule/update.svg'}
              alt={'생활규칙 수정아이콘'}
              width={80}
              height={80}
              style={{ objectFit: 'cover' }}
            />
            <TitleContainer>
              <Title>당번이 없습니다</Title>
            </TitleContainer>
            <Description>친구들과 대화를 통해 당번을 만들어보세요!</Description>

            <ConfirmButton
              label={'당번 생성하러 가기'}
              onClick={() => {
                router.push('duty/create')
              }}
            />
          </EmptyContainer>
        </PaddingContainer>
      )}
    </Container>
  )
}
