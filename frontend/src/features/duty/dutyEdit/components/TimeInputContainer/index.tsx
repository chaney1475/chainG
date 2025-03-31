'use client'

import { useTranslation } from 'react-i18next'

import { IconButton } from '@/components'
import '@/styles/styles'

import {
  Container,
  IconContainer,
  TimePickerContainer,
  TopContainer,
} from './styles'

export function TimeInputContainer() {
  const { t } = useTranslation()
  return (
    <Container>
      <TopContainer>
        <IconButton
          src="/icons/time-clock.svg"
          alt="time-icon"
        />
        <div> {t(`duty.edit.time.description`)} </div>
      </TopContainer>
      <hr />
      <TimePickerContainer>
        <div>시간 드르륵</div>
      </TimePickerContainer>
    </Container>
  )
}
