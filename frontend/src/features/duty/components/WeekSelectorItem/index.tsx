'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import '@/styles/styles'
import { Duty } from '@/types/duty'

import { Container, DateSelection } from './styles'

interface WeekSelectorItemProps {
  key: string
  day: string
  date: number
  duty: Duty[]
}

export function WeekSelectorItem({
  key,
  day,
  date,
  duty,
}: WeekSelectorItemProps) {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Container>
      <div>{day}</div>
      <DateSelection>{date}</DateSelection>
      {duty.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </Container>
  )
}
