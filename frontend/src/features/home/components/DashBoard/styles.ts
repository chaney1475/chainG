import styled from '@emotion/styled'
import Link from 'next/link'

export const Card = styled(Link)`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  border: 1px solid transparent;
  flex: 1;
  border-radius: 16px;
  color: ${({ theme }) => theme.color.text.low};
  ${({ theme }) => theme.typography.styles.topHeader}
  background-color: ${({ theme }) => theme.color.background.white};
  box-shadow: 0px 0px 20px 0px rgba(118, 118, 118, 0.25);
  transition:
    opacity 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  & > img {
    margin-left: auto;
  }
  cursor: pointer;
`

export const Description = styled.div`
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

export const Category = styled.div`
  ${({ theme }) => theme.typography.styles.cardDescription}
`
export const CardContainer = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
`

export const StyledButton = styled.button<{ isSelected: boolean }>`
  padding: 20px;
  margin: 20px 0;
  border-radius: 16px;
  border: none;
  text-align: center;
  width: 100%;

  ${({ theme }) => theme.typography.styles.button};
  cursor: pointer;
  outline: none;

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

  ${({ isSelected, theme }) => {
    switch (isSelected) {
      case true:
        return `
          background-color: ${theme.color.primary};
          color: white;
        `
      case false:
        return `
          background-color: ${theme.color.border};
          color: ${theme.color.text.disabled};
          cursor: not-allowed;
        `
      default:
        return ''
    }
  }}
`
export const IssueContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 1rem;
  border: none;
  > img {
    position: absolute;
    top: 12px;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 30px;
  }
`

export const IssueContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 1rem;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.color.background.white};
  box-shadow: 0px 0px 20px 0px rgba(118, 118, 118, 0.25);
`
