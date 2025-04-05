import { Theme, css } from '@emotion/react'
import styled from '@emotion/styled'

const getVariantStyles = (variant: 'bar' | 'tile') => css`
  justify-content: ${variant === 'bar' ? 'flex-start' : 'center'};
  align-items: center;
  flex-direction: ${variant === 'bar' ? 'row' : 'column'};
  gap: ${variant === 'bar' ? '1rem' : '0.5rem'};
`
const getNameStyles = (size: 'small' | 'medium' | 'large') => css`
  ${size === 'small' ? '60px' : size === 'medium' ? '77px' : '80px'};
`

const getSizeStyles = (size: 'small' | 'medium' | 'large', theme: Theme) =>
  size === 'small'
    ? theme.typography.styles.name
    : theme.typography.styles.default

export const ProfileContainer = styled.div<{
  variant: 'bar' | 'tile'
  size: 'small' | 'medium' | 'large'
}>`
  display: flex;
  color: ${({ theme }) => theme.color.text.low};
  white-space: nowrap;
  ${({ variant }) => getVariantStyles(variant)}
  ${({ size, theme }) => getSizeStyles(size, theme)}
  > span {
    text-align: ${({ variant }) => (variant === 'bar' ? 'left' : 'center')};
    width: ${({ size }) => getNameStyles(size)};
  }
`
