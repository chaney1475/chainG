'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import '@/styles/styles'
import { Duty } from '@/types/duty'

import { Container, DateSelection, DutyContainer, DutyItem } from './styles'

interface WeekSelectorItemProps {
  key: string
  day: string
  date: number
  duty: Duty[]
}

export function WeekSelectorItem({ day, date, duty }: WeekSelectorItemProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [isSelected, setIsSelected] = useState(false)
  const onClick = () => {
    setIsSelected(!isSelected)
  }

  return (
    <Container>
      <div>{day}</div>
      <DateSelection onClick={onClick}>{date}</DateSelection>
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
