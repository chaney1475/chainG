'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { IconButton } from '@/components/IconButton'
import '@/styles/styles'

import { WeekSelector } from '../WeekSelector'
import { Container, TextContainer, TopContainer } from './styles'

export function WeekList() {
  const { t } = useTranslation()
  const router = useRouter()
  const week = 'second'

  const handleClick = () => {
    router.push('/duty/edit')
  }

  return (
    <Container>
      <TopContainer>
        <div>3월 {t(`duty.schedule.week.${week}`)}</div>
        <TextContainer>
          <div>이번주 당번</div>
          <IconButton
            src="/icons/plus_circle.svg"
            alt="plus_circle"
            onClick={handleClick}
          />
        </TextContainer>
      </TopContainer>

      <WeekSelector />
    </Container>
  )
}
