'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { useRouter } from 'next/navigation'

import styles from '../signup.module.css'

interface SignupForm {
  name: string
}

export default function SignupNamePage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>()

  useEffect(() => {
    // 이메일이 없으면 첫 단계로 리다이렉트
    const email = sessionStorage.getItem('signupEmail')
    if (!email) {
      router.push('/signup')
    }
  }, [router])

  const onSubmit = async (data: SignupForm) => {
    try {
      // 이름을 세션 스토리지에 저장
      sessionStorage.setItem('signupName', data.name)
      // 다음 단계로 이동
      router.push('/signup/password')
    } catch (error) {
      console.error('이름 저장 실패:', error)
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
          <div className={`${styles.step} ${styles.active}`}>2</div>
          <div className={styles.step}>3</div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">이름</label>
          <input
            id="name"
            type="text"
            {...register('name', {
              required: '이름을 입력해주세요',
              minLength: {
                value: 2,
                message: '이름은 최소 2자 이상이어야 합니다',
              },
            })}
          />
          {errors.name && (
            <span className={styles.error}>{errors.name.message}</span>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitButton}>
          다음
        </button>
      </form>
    </div>
  )
}
