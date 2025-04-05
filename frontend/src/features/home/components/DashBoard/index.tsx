import {
  Container,
  DefaultContainer,
  SlimContainer,
  Title,
  TitleContainer,
} from '@/styles/styles'

import { Card, CardDescription } from './styles'

export function DashBoard() {
  return (
    <Container>
      <DefaultContainer>
        <Title>오늘나의 이슈</Title>
        <SlimContainer>전체 당번 월세 </SlimContainer>
        <TitleContainer>
          <SlimContainer>
            <CardDescription>월세</CardDescription> 미납 납부하기
          </SlimContainer>
          <SlimContainer>
            <CardDescription>당번</CardDescription>
            <CardDescription> 18:00</CardDescription>
          </SlimContainer>
          <SlimContainer>
            <CardDescription>당번</CardDescription>
            청소하기
            <CardDescription>오늘</CardDescription>
          </SlimContainer>
        </TitleContainer>
      </DefaultContainer>
      <DefaultContainer>
        <Title>생활 관리</Title>
        <TitleContainer>
          <SlimContainer>
            <Card href="/lifeRule">생활 규칙 </Card>
          </SlimContainer>
          <SlimContainer>
            <Card href="/duty">당번 정하기</Card>
          </SlimContainer>
        </TitleContainer>
      </DefaultContainer>
    </Container>
  )
}
