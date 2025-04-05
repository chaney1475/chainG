import styled from '@emotion/styled'

import { ContractStatus } from '@/types/contract'

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const SwitchContainer = styled.div<{ checked: boolean }>`
  position: relative;
  width: 120px;
  height: 38px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.color.border};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin: auto;
`

export const SwitchText = styled.span<{ checked: boolean }>`
  color: ${({ checked, theme }) =>
    checked ? theme.color.background.white : theme.color.text.low};
  z-index: 1;
  ${({ theme }) => theme.typography.styles.name};
  user-select: none;
`

export const StatusLabelContainer = styled.div<{ variant: ContractStatus }>`
  position: absolute;
  top: 3px;
  width: 57px;
  height: 32px;
  ${({ variant, theme }) => {
    switch (variant) {
      case ContractStatus.pending:
        return `
          background-color: ${theme.color.primary};
          color: white;
        `
      case ContractStatus.confirmed:
        return `
          background-color: ${theme.color.background.create};
          color: ${theme.color.background.white};
          cursor: not-allowed;
        `
      case ContractStatus.shouldInvite:
        return `
          background-color: ${theme.color.secondary};
          color: ${theme.color.text.low};
        `
      default:
        return ''
    }
  }}
  border-radius: 14px;
  transition: left 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`
