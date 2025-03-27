'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { useRouter } from 'next/navigation'

import { TitleHeaderLayout } from '@/components'
import { InputBox } from '@/components'
import { setSignUpName } from '@/store/slices/authSlice'
import { RootState } from '@/store/store'
import { Form } from '@/styles/styles'

interface SignupForm {
  name: string
}

export function SignUpNamePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()
  const signUp = useSelector((state: RootState) => state.auth.signUpRequest)
  const emailAddress = signUp?.emailAddress
  const name = signUp?.name

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>()

  const onSubmit = async (data: SignupForm) => {
    try {
      dispatch(setSignUpName(data.name))
      router.push('/auth/signup/password')
    } catch (error) {
      console.error('이름 저장 실패:', error)
    }
  }

  return (
    <TitleHeaderLayout
      header={t('signUp.name.title')}
      onClick={() => {
        const form = document.querySelector('form')
        if (form) {
          form.requestSubmit()
        }
      }}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputBox
          label={t('signUp.name.label')}
          id="name"
          type="text"
          error={errors.name}
          {...register('name', {
            required: t('signUp.name.error.required'),
            minLength: {
              value: 2,
              message: t('signUp.name.error.minLength'),
            },
          })}
        />
      </Form>
    </TitleHeaderLayout>
  )
}
