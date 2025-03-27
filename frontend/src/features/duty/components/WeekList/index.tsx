'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import '@/styles/styles'

import { WeekSelector } from '../WeekSelector'
import {
  Container,
  ImageContainer,
  TextContainer,
  TopContainer,
} from './styles'

export function WeekList() {
  const { t } = useTranslation()
  const router = useRouter()
  const week = 'second'

  return (
    <Container>
      <TopContainer>
        <div>3월 {t(`duty.schedule.week.${week}`)}</div>
        <TextContainer>
          <div>이번주 당번</div>
          <ImageContainer>
            <Image
              src="/icons/plus_circle.svg"
              alt="plus_circle"
              fill
              style={{ objectFit: 'contain' }}
            />
          </ImageContainer>
        </TextContainer>
      </TopContainer>

      <WeekSelector />
    </Container>
  )
}
