import styled from '@emotion/styled'

import { CustomTheme } from '@/styles/themes'
import { LifeRuleUpdateVariant } from '@/types/lifeRule'

export const Container = styled.div`
  padding: 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  justify-content: center;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.background.white};
`

export const CatrgoryIcon = styled.div`
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Content = styled.div`
  display: flex;
  width: 100%;
  margin: auto;
  ${({ theme }) => theme.typography.styles.inputBoxTitle};
  color: ${({ theme }) => theme.color.text.regular};
`

interface StyledButtonProps {
  variant: LifeRuleUpdateVariant
}

export const ItemContainer = styled(Container)<StyledButtonProps>`
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  color: ${({ theme }) => theme.color.text.regular};
  ${({ theme }) => theme.typography.styles.button};

  ${({ variant, theme }: StyledButtonProps & { theme: CustomTheme }) => {
    switch (variant) {
      case 'DELETE':
        return `
          background-color: ${theme.color.background.delete};
          border: 1px solid ${theme.color.text.sunday};
        `
      default:
        return `
        background-color: ${theme.color.background.white};
        border: 1px solid ${theme.color.border};
      `
    }
  }}
`

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: auto;
`
