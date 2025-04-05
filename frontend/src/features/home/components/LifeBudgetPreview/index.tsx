import { useRouter } from 'next/navigation'

import {
  DefaultContainer,
  SlimContainer,
  Title,
  TitleContainer,
} from '@/styles/styles'

import { CardDescription } from './styles'

export function LifeBudgetPreview() {
  const router = useRouter()
  return (
    <DefaultContainer onClick={() => router.push('/budget/living')}>
      <SlimContainer>
        <TitleContainer>
          <Title>생활비</Title>
          <SlimContainer>총액 100,000원</SlimContainer>
        </TitleContainer>
      </SlimContainer>
      <SlimContainer>
        <TitleContainer>
          <CardDescription>과자값</CardDescription>
          <CardDescription>120,000원</CardDescription>
        </TitleContainer>
      </SlimContainer>
      <SlimContainer>
        <TitleContainer>
          <CardDescription>gs편의점</CardDescription>
          <CardDescription>100,000원</CardDescription>
        </TitleContainer>
      </SlimContainer>
    </DefaultContainer>
  )
}
