'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useStore } from 'react-redux'

import { useRouter } from 'next/navigation'

import { InputBox, TitleHeaderLayout } from '@/components'
import { clearSignUp, setSignUpEmail } from '@/store/slices/authSlice'
import { Form } from '@/styles/styles'

interface SignupForm {
  emailAddress: string
}

export function SignUpPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()
  const store = useStore()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>()

  const onSubmit = async (data: SignupForm) => {
    try {
      dispatch(setSignUpEmail(data.emailAddress))
      router.push('/auth/signup/name')
    } catch (error) {
      console.error('이메일 저장 실패:', error)
      dispatch(clearSignUp())
    }
  }

  return (
    <TitleHeaderLayout
      header={t('signUp.email.title')}
      onClick={() => {
        const form = document.querySelector('form')
        if (form) {
          form.requestSubmit()
        }
      }}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputBox
          label={t('signUp.email.label')}
          id="emailAddress"
          type="email"
          error={errors.emailAddress}
          {...register('emailAddress', {
            required: t('signUp.email.error.required'),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('signUp.email.error.invalidEmail'),
            },
          })}
        />
      </Form>
    </TitleHeaderLayout>
  )
}
