'use client'

import { forwardRef } from 'react'

import styled from '@emotion/styled'

interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`

const StyledInput = styled.input`
  width: 100%;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 16px;
  ${({ theme }) => theme.typography.styles.default};
  font-size: 16px;
  background: ${({ theme }) => theme.color.secondary};
  transition: all 0.2s ease-in-out;

  &::placeholder {
    ${({ theme }) => theme.typography.styles.default};
    color: ${({ theme }) => theme.color.text.disabled};
  }

  &:focus {
    border-color: ${({ theme }) => theme.color.primary};
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.color.primary}33;

    &::placeholder {
      color: transparent;
    }
  }
`

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  ${({ theme }) => theme.typography.styles.inputBoxTitle};
  color: ${({ theme }) => theme.color.text.regular};
`

const ErrorMessage = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.color.text.distructive};
`

export const InputBox = forwardRef<HTMLInputElement, InputBoxProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <InputContainer>
        {label && <Label>{label}</Label>}
        <StyledInput
          ref={ref}
          {...props}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </InputContainer>
    )
  },
)

InputBox.displayName = 'InputBox'
