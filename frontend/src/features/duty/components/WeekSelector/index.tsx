'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { Container, Form, Main } from '@/styles/styles'

// 공용 컴포넌트 쓰겠다. -> from ~~

import { FullMain, Navigator } from './styles'

// 내 하위에 있는 style을 쓰겠다
export function WeekSelector() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Container>
      <div> 요일 선택 컴포넌트다 </div>
    </Container>
  )
}
