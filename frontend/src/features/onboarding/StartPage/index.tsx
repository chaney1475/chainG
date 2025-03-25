import { useForm } from 'react-hook-form'

import { useRouter } from 'next/navigation'

import { Container } from './styles'

interface LoginForm {
  email: string
  password: string
}

export function StartPage() {
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

  return <Container></Container>
}
