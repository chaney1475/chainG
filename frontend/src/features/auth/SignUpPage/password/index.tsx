'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { useRouter } from 'next/navigation'

import { signUp } from '@/apis/auth'
import { InputBox, TitleHeaderLayout } from '@/components'
import { clearSignUp, setSignUpPassword } from '@/store/slices/authSlice'
import { RootState } from '@/store/store'
import { Form } from '@/styles/styles'

interface SignupForm {
  password: string
  confirmPassword: string
}

export function SignUpPasswordPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>()
  const signUpRequest = useSelector(
    (state: RootState) => state.auth.signUpRequest,
  )

  const password = watch('password')

  const [validations, setValidations] = useState([
    { isValid: false, message: '영문 포함' },
    { isValid: false, message: '숫자 포함' },
    { isValid: false, message: '8~20자 이내' },
  ])

  useEffect(() => {
    if (password) {
      setValidations([
        { isValid: /[a-zA-Z]/.test(password), message: '영문 포함' },
        { isValid: /[0-9]/.test(password), message: '숫자 포함' },
        {
          isValid: password.length >= 8 && password.length <= 20,
          message: '8~20자 이내',
        },
      ])
    }
  }, [password])

  useEffect(() => {
    if (signUpRequest?.password) {
      const handleSignUp = async () => {
        try {
          console.log('signUpRequest', signUpRequest)
          const response = await signUp(signUpRequest)
          console.log('회원가입 성공:', response)
          dispatch(clearSignUp())
          if (response) {
            router.push('/')
          }
        } catch (error) {
          console.error('회원가입 실패:', error)
        }
      }

      handleSignUp()
    }
  }, [signUpRequest?.password, dispatch])

  const onSubmit = async (data: SignupForm) => {
    dispatch(setSignUpPassword(data.password))
  }

  return (
    <TitleHeaderLayout
      header={t('signUp.password.title')}
      onClick={() => {
        const form = document.querySelector('form')
        if (form) {
          form.requestSubmit()
        }
      }}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputBox
          label={t('signUp.password.label')}
          id="password"
          type="password"
          error={errors.password}
          validations={validations}
          {...register('password', {
            required: t('signUp.password.error.required'),
            minLength: {
              value: 8,
              message: t('signUp.password.error.minLength'),
            },
          })}
        />
        <InputBox
          label={t('signUp.confirmPassword.label')}
          id="confirmPassword"
          type="password"
          error={errors.confirmPassword}
          {...register('confirmPassword', {
            required: '비밀번호를 다시 입력해주세요',
            validate: (value) =>
              value === watch('password') || '비밀번호가 일치하지 않습니다',
          })}
        />
      </Form>
    </TitleHeaderLayout>
  )
}
