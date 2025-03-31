import styled from '@emotion/styled'
import Link from 'next/link'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 16px;
`

export const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  gap: 16px;
  ${({ theme }) => theme.typography.styles.title}
  color: ${({ theme }) => theme.color.text.regular}
`

export const TaskButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
  width: 100%;

  > button {
    display: flex;
    justify-content: center;
    align-items: start;
    width: 100%;
    padding: 1rem;
    flex-direction: column;

    border: 1px solid ${({ theme }) => theme.color.border};
    border-radius: 1rem;

    color: ${({ theme }) => theme.color.text.disabled};
    ${({ theme }) => theme.typography.styles.default};
    background: ${({ theme }) => theme.color.secondary};
  }
`
