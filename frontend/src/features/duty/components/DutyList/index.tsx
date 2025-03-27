'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { dutyList } from '@/constants/dutyList'

import { DutyListItem } from '../DutyListItem'
import { Container } from './styles'

// 내 하위에 있는 style을 쓰겠다

interface LoginForm {
  emailAddress: string
  password: string
}

export function DutyList() {
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
      {dutyList.monday.map((duty) => (
        <DutyListItem
          key={duty.id}
          duty={duty}
        />
      ))}
    </Container>
  )
}
