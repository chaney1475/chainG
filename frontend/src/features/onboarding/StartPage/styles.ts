import styled from '@emotion/styled'
import Link from 'next/link'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.color.secondary};
`

export const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.color.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: ${({ theme }) => theme.typography.fonts.paperlogyRegular};

  &:hover {
    background-color: ${({ theme }) => theme.color.primary}dd;
  }
`

export const SignupLinkContainer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: ${({ theme }) => theme.color.text.low};
  font-family: ${({ theme }) => theme.typography.fonts.paperlogyRegular};
`

export const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.color.primary};
  text-decoration: none;
  margin-left: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fonts.paperlogyRegular};

  &:hover {
    text-decoration: underline;
  }
`
