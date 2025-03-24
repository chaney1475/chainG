'use client'

import { useForm } from 'react-hook-form'

import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { InputBox } from '@/components/InputBox'

interface LoginForm {
  email: string
  password: string
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }
`

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }
`

const SignupLinkContainer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
`

const StyledLink = styled(Link)`
  color: #4a90e2;
  text-decoration: none;
  margin-left: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`

export default function LoginPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
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
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h1>로그인</h1>

        <InputBox
          label="이메일"
          placeholder="이메일을 입력해주세요"
          {...register('email', {
            required: '이메일을 입력해주세요',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '올바른 이메일 형식이 아닙니다',
            },
          })}
          error={errors.email?.message}
        />

        <InputBox
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          {...register('password', {
            required: '비밀번호를 입력해주세요',
            minLength: {
              value: 6,
              message: '비밀번호는 최소 6자 이상이어야 합니다',
            },
          })}
          error={errors.password?.message}
        />

        <SubmitButton type="submit">로그인</SubmitButton>

        <SignupLinkContainer>
          계정이 없으신가요?
          <StyledLink href="/signup">회원가입</StyledLink>
        </SignupLinkContainer>
      </Form>
    </Container>
  )
}
