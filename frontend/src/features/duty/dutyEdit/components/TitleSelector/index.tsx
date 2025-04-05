'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { InputBox } from '@/components'

import { Container, TopContainer } from './styles'

interface TitleSelectorProps {
  title: string | undefined
}

export function TitleSelector({ title }: TitleSelectorProps) {
  const { register } = useFormContext()
  const { t } = useTranslation()

  return (
    <Container>
      <TopContainer>
        <div>할 일 입력</div>
      </TopContainer>
      <InputBox
        id="title"
        placeholder="할 일을 입력해주세요"
        type="text"
        value={title}
        {...register('title', {
          required: t('signUp.password.error.required'),
        })}
      />
    </Container>
  )
}
