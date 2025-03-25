'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { ConfirmButton, InputBox } from '@/components'
import { Form, Main } from '@/styles/styles'

import {
  Container,
  SignupLinkContainer,
  StyledLink,
  SubmitButton,
} from './styles'

interface LoginForm {
  emailAddress: string
  password: string
}

export function LoginPage() {
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
      <Main>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputBox
            label={t('login.email.label')}
            id="emailAddress"
            type="email"
            placeholder={t('login.email.placeholder')}
            {...register('emailAddress', {
              required: t('login.email.error.required'),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t('login.email.error.invalidEmail'),
              },
            })}
            error={errors.emailAddress}
          />

          <InputBox
            id="password"
            label={t('login.password.label')}
            type="password"
            placeholder={t('login.password.placeholder')}
            {...register('password', {
              required: t('login.password.error.required'),
              minLength: {
                value: 6,
                message: t('login.password.error.length'),
              },
            })}
            error={errors.password}
          />

          <SubmitButton type="submit">로그인</SubmitButton>
          <ConfirmButton
            onClick={handleSubmit(onSubmit)}
            label={t('login.title')}
          />

          <SignupLinkContainer>
            <StyledLink href="/group/create/createProfile">
              createProfile
            </StyledLink>
            <StyledLink href="/group/create/inviteCode">invite</StyledLink>
            <StyledLink href="/auth/signup">회원가입</StyledLink>
          </SignupLinkContainer>
        </Form>
      </Main>
    </Container>
  )
}
