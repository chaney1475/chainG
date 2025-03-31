'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import '@/styles/styles'
import { DayKey, Duty, SelectorVariant } from '@/types/duty'

import { Container, DateSelection, DutyContainer, DutyItem } from './styles'

interface WeekSelectorItemProps {
  day: DayKey
  date: number
  duty: Duty[]
}

export function WeekSelectorItem({ day, date, duty }: WeekSelectorItemProps) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(false)
  function checkSelect(select: boolean, day: string): SelectorVariant {
    if (select === true) {
      return 'select'
    }
    return day === 'sunday' || day === 'saturday' ? day : 'default'
  }

  return (
    <Container>
      <div>{`${t(`duty.week.${day}`)}`}</div>
      <DateSelection variant={checkSelect(selected, day)}>
        {' '}
        {date}
      </DateSelection>
      <DutyContainer>
        {duty.map((item) => (
          <DutyItem key={item.id}>
            {t(`duty.category.${item.category}`)}
          </DutyItem>
        ))}
      </DutyContainer>
    </Container>
  )
}
