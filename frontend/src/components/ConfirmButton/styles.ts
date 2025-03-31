import styled from '@emotion/styled'

import { CustomTheme } from '@/styles/themes'
import { ButtonVariant } from '@/types/ui'

interface StyledButtonProps {
  variant: ButtonVariant
}

export const StyledButton = styled.button<StyledButtonProps>`
  padding: 20px;
  margin: 20px 0;
  border-radius: 16px;
  border: none;
  text-align: center;
  width: 100%;

  ${({ theme }) => theme.typography.styles.button};

  ${({ variant, theme }: StyledButtonProps & { theme: CustomTheme }) => {
    switch (variant) {
      case 'next':
        return `
          background-color: ${theme.color.primary};
          color: white;
        `
      case 'disabled':
        return `
          background-color: ${theme.color.border};
          color: ${theme.color.text.disabled};
          cursor: not-allowed;
        `
      case 'prev':
        return `
          background-color: ${theme.color.secondary};
          color: ${theme.color.text.low};
        `
      default:
        return ''
    }
  }}
`
