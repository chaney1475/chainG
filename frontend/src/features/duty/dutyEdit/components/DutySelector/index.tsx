'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Container, TaskButtonContainer, TopContainer } from './styles'

interface DutySelectorProps {
  setIsBottomSheetOpen: (isBottomSheetOpen: boolean) => void
}

export function DutySelector({ setIsBottomSheetOpen }: DutySelectorProps) {
  const { t } = useTranslation()

  return (
    <Container>
      <TopContainer>
        <div>{t('duty.edit.duty.title')}</div>
      </TopContainer>
      <TaskButtonContainer>
        <button onClick={() => setIsBottomSheetOpen(true)}>
          {t('duty.edit.duty.placeholder')}
        </button>
      </TaskButtonContainer>
    </Container>
  )
}
