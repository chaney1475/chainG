import styled from '@emotion/styled'
import Link from 'next/link'

export const CardContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
`

export const Card = styled(Link)`
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 100%;
  border: none;
  align-items: center;
  border-radius: 16px;
  color: ${({ theme }) => theme.color.text.low};
  ${({ theme }) => theme.typography.styles.topHeader}
  background-color: ${({ theme }) => theme.color.secondary};
`

export const CardDescription = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  ${({ theme }) => theme.typography.styles.cardDescription}
  background-color: ${({ theme }) => theme.color.background.white};
  white-space: pre-line;
`
