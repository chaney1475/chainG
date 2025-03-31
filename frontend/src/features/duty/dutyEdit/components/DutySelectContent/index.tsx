'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ConfirmButton } from '@/components'
import { User } from '@/constants/userList'

import { DutySelectItem } from '../DutySelectItem'
import {
  Container,
  DutySelectItemContainer,
  SheetBottomContainer,
  TextContainer,
  TopContainer,
} from './styles'

interface DutySelectContentProps {
  userList: User[]
  selectedUsers: number[]
  onConfirm: (selected: number[]) => void
}

export function DutySelectContent({
  userList,
  selectedUsers,
  onConfirm,
}: DutySelectContentProps) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<number[]>(selectedUsers)
  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  return (
    <Container>
      <TopContainer>
        <TextContainer>{t('duty.edit.duty.placeholder')}</TextContainer>
        <DutySelectItemContainer>
          {userList.map((user) => (
            <DutySelectItem
              key={user.id}
              user={user}
              selected={selected.includes(user.id)}
              onClick={() => toggle(user.id)}
            />
          ))}
        </DutySelectItemContainer>
      </TopContainer>
      <SheetBottomContainer>
        <ConfirmButton
          label="선택 완료"
          onClick={() => onConfirm(selected)}
        />
      </SheetBottomContainer>
    </Container>
  )
}
