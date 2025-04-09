import styled from '@emotion/styled'
import Link from 'next/link'

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  max-height: 60vh;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.color.secondary};
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
export const NoticeItem = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 16px;
  padding: 16px;
  gap: 8px;
  background-color: ${({ theme }) => theme.color.background.white};
  justify-content: space-between;
  margin: 8px 20px;
`

export const NoticeTitle = styled.span`
  display: flex;
  ${({ theme }) => theme.typography.styles.topHeader};
  color: ${({ theme }) => theme.color.text.regular};
  gap: 4px;
  & + div {
    ${({ theme }) => theme.typography.styles.inputBoxTitle};
    color: ${({ theme }) => theme.color.text.low};
  }
`

export const LinkContainer = styled.div`
  margin: auto 0;
`

export const StyledLink = styled(Link)`
  gap: 8px;
  cursor: pointer;
  outline: none;
  border-radius: 16px;
  padding: 8px 16px;
  white-space: nowrap;
  display: flex;
  flex:0;
  margin-auto;
  background-color: ${({ theme }) => theme.color.primary};
  color: ${({ theme }) => theme.color.background.white};
  ${({ theme }) => theme.typography.styles.name};
  &:focus {
    outline: 1px solid ${({ theme }) => theme.color.primary};
    outline-offset: 1px;
    border-color: ${({ theme }) => theme.color.primary};
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.color.primary}33;
  }
  &:hover {
    opacity: 0.8;
    transition: opacity 0.3s ease;
    outline: 1px solid ${({ theme }) => theme.color.primary};
  }
`
