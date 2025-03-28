'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import '@/styles/styles'
import { DayKey, SelectorVariant } from '@/types/duty'

import { Container, DateSelection } from './styles'

interface WeekSelectorItemProps {
  day: DayKey
}

export function WeekSelectorItem({ day }: WeekSelectorItemProps) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(false)
  function checkSelect(select: boolean, day: DayKey): SelectorVariant {
    if (select === true) {
      return 'select'
    }
    return day === 'sunday' || day === 'saturday' ? day : 'default'
  }

  return (
    <Container>
      <DateSelection
        variant={checkSelect(
          selected,
          day,
        )}>{`${t(`duty.week.${day}`)}`}</DateSelection>
    </Container>
  )
}
