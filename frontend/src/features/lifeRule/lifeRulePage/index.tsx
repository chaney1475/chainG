'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { ConfirmButton, InputBox, TitleHeader } from '@/components'
import { Form, Main, Container } from '@/styles/styles'
import {TopHeader} from '@/features/lifeRule/components/TopHeader'  
import {
  SignupLinkContainer,
  StyledLink,
  SubmitButton,FullMain,
  NavigatorBar,
} from './styles'

interface LoginForm {
  emailAddress: string
  password: string
}

export function LifeRulePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm): Promise<void> => {
    try {
      // TODO: 실제 로그인 API 호출 구현
      console.log('로그인 데이터:', data)
      router.push('/')
    } catch (error) {
      console.error('로그인 실패:', error)
    }
  }

  return (
    <Container>
      <TopHeader title={t('lifeRule.title')} />
      <FullMain>
        
      </FullMain>
      <NavigatorBar></NavigatorBar>
    </Container>
  )
}
