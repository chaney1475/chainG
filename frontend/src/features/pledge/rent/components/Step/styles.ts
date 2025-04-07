import styled from '@emotion/styled'

import { BudgetStatus } from '@/types/budget'

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 30px;
`

export const TopDescription = styled.div`
  width: 100%;
  ${({ theme }) => theme.typography.styles.name};
  color: ${({ theme }) => theme.color.text.disabled};
`

export const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 16px;
`

export const StepItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
`

export const BarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 14px;
  width: 100%;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.color.secondary};
`

export const StatusIcon = styled.div<{ variant: BudgetStatus }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;

  ${({ variant, theme }) => {
    switch (variant) {
      case 'complete':
        return `
          background-color: ${theme.color.text.confirm};
        `
      case 'debt':
        return `
          background-color: ${theme.color.text.distructive};
        `
      case 'expected':
        return `
          background-color: ${theme.color.primary};
        `
    }
  }}
`
