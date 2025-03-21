'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { useRouter } from 'next/navigation'

import styles from '../signup.module.css'

interface SignupForm {
  password: string
  confirmPassword: string
}

export default function SignupPasswordPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>()

  useEffect(() => {
    // 이메일과 이름이 없으면 첫 단계로 리다이렉트
    const email = sessionStorage.getItem('signupEmail')
    const name = sessionStorage.getItem('signupName')
    if (!email || !name) {
      router.push('/signup')
    }
  }, [router])

  const onSubmit = async (data: SignupForm) => {
    try {
      // 회원가입 데이터 수집
      const signupData = {
        email: sessionStorage.getItem('signupEmail'),
        name: sessionStorage.getItem('signupName'),
        password: data.password,
      }

      // TODO: 실제 회원가입 API 호출 구현
      console.log('회원가입 데이터:', signupData)

      // 세션 스토리지 클리어
      sessionStorage.removeItem('signupEmail')
      sessionStorage.removeItem('signupName')

      // 로그인 페이지로 이동
      router.push('/login')
    } catch (error) {
      console.error('회원가입 실패:', error)
    }
  }

  return (
    <div className={styles.container}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}>
        <h1>회원가입</h1>
        <div className={styles.stepIndicator}>
          <div className={styles.step}>1</div>
          <div className={styles.step}>2</div>
          <div className={`${styles.step} ${styles.active}`}>3</div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: '비밀번호를 입력해주세요',
              minLength: {
                value: 6,
                message: '비밀번호는 최소 6자 이상이어야 합니다',
              },
            })}
          />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', {
              required: '비밀번호를 다시 입력해주세요',
              validate: (value) =>
                value === watch('password') || '비밀번호가 일치하지 않습니다',
            })}
          />
          {errors.confirmPassword && (
            <span className={styles.error}>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitButton}>
          회원가입 완료
        </button>
      </form>
    </div>
  )
}
