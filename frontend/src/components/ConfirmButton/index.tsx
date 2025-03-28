'use client'

import { useTranslation } from 'react-i18next'

import { ButtonVariant } from '@/types/ui'

import { StyledButton } from './styles'

interface ConfirmButtonProps {
  label?: string
  onClick?: () => void
  variant?: ButtonVariant
}

export const ConfirmButton = ({
  label = 'next',
  onClick,
  variant = 'next',
}: ConfirmButtonProps) => {
  const { t } = useTranslation()
  return (
    <StyledButton
      variant={variant}
      onClick={onClick}>
      {t(label)}
    </StyledButton>
  )
}
