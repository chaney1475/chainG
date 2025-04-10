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
  > div span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100px;
  }
`

export const BarContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  height: 14px;
  min-width: 50%;
  width: 70%;
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
      case 'none':
        return `
          background-color: ${theme.color.secondary};
        `
    }
  }}
`

export const StatusBarContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  position: absolute;
  top: 0px;
  left: 14px; /* BarWrapper의 좌우 padding과 동일하게 */
  right: 14px;
`

export const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;

  > div {
    ${({ theme }) => theme.typography.styles.tiny};
    color: ${({ theme }) => theme.color.text.disabled};
  }
`

// 상단 월 라벨 영역
export const MonthLabelsContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  width: 100%;
  margin: 0 10px 0 30px;
`

export const MonthLabel = styled.div`
  position: relative;
  height: auto;
  overflow: visible;
  text-align: center;
`

export const MonthText = styled.div`
  ${({ theme }) => theme.typography.styles.navigator};
  color: ${({ theme }) => theme.color.text.low};
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
`

export const MonthContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
  min-width: 50%;
  width: 70%;
  min-height: 10px;
`

export const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`
