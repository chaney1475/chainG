import { useTranslation } from 'react-i18next'

import styled from '@emotion/styled'

import { ShowBox } from '@/styles/styles'

interface CardProps {
  selected?: boolean
  onSelect?: () => void
  title?: string
  description?: string
}

const Container = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 2px solid ${({ selected }) => (selected ? '#007AFF' : '#ddd')};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ selected }) => (selected ? '#F0F8FF' : 'white')};

  &:hover {
    border-color: #007aff;
  }
`

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
`

const Description = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`

export function Card({
  selected = false,
  onSelect,
  title,
  description,
}: CardProps) {
  const { t } = useTranslation()

  return (
    <Container
      selected={selected}
      onClick={onSelect}>
      <ShowBox onClick={onSelect}></ShowBox>
    </Container>
  )
}
