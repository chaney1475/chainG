'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

import { InputBox } from '@/components'
import '@/styles/styles'

import { Container, TopContainer } from './styles'

export function TaskSelector() {
  const { t } = useTranslation()

  return (
    <Container>
      <TopContainer>
        <div>할 일 입력</div>
      </TopContainer>
      <InputBox
        id="task"
        placeholder="할 일을 입력해주세요"
        type="text"
      />
    </Container>
  )
}
