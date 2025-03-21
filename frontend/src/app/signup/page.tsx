'use client'

import { useForm } from 'react-hook-form'

import { useRouter } from 'next/navigation'

import styles from './signup.module.css'

interface SignupForm {
  email: string
}

export default function SignupPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>()

  const onSubmit = async (data: SignupForm) => {
    try {
      // 이메일을 세션 스토리지에 저장
      sessionStorage.setItem('signupEmail', data.email)
      // 다음 단계로 이동
      router.push('/signup/name')
    } catch (error) {
      console.error('이메일 저장 실패:', error)
    }
  }

  return (
    <div className={styles.container}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}>
        <h1>회원가입</h1>
        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${styles.active}`}>1</div>
          <div className={styles.step}>2</div>
          <div className={styles.step}>3</div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: '이메일을 입력해주세요',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '올바른 이메일 형식이 아닙니다',
              },
            })}
          />
          {errors.email && (
            <span className={styles.error}>{errors.email.message}</span>
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
