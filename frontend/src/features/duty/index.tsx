'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { ConfirmButton, InputBox, TopHeader } from '@/components'
import { Container, Form, Main } from '@/styles/styles'

import { DutyList } from './components/DutyList'
// 공용 컴포넌트 쓰겠다. -> from ~~
import { FullMain, Navigator } from './styles'

// 내 하위에 있는 style을 쓰겠다

interface LoginForm {
  emailAddress: string
  password: string
}

export function DutyPage() {
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
      <TopHeader title={t('duty.title')} />
      <FullMain>
        <DutyList />
      </FullMain>
      <Navigator></Navigator>
    </Container>
  )
}
