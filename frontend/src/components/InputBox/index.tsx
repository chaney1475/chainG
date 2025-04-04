'use client'

import { forwardRef, memo, useEffect, useState } from 'react'
import { FieldError } from 'react-hook-form'

import Image from 'next/image'

import { ValidationItem } from '@/types/ui'

import {
  InputContainer,
  Label,
  StyledInput,
  ValidationContainer,
  ValidationMessage,
  ValidationWrapper,
} from './styles'

interface InputBoxProps {
  id: string
  type?: string
  error?: FieldError
  value?: string
  placeholder?: string
  label?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  disabled?: boolean
  required?: boolean
  validations?: { [key: string]: ValidationItem }
}

const InputBoxBase = forwardRef<HTMLInputElement, InputBoxProps>(
  (
    {
      error,
      placeholder = '',
      label,
      id,
      className,
      disabled,
      required,
      validations,
      type,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const isError = !!error
    const message = error?.message
    const [displayValue, setDisplayValue] = useState(value || '')
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
      if (type === 'money' && value) {
        const numericValue = value.replace(/[^0-9]/g, '')
        if (isFocused) {
          setDisplayValue(numericValue)
        } else {
          const formattedValue = new Intl.NumberFormat('ko-KR').format(
            Number(numericValue),
          )
          setDisplayValue(`${formattedValue} 원`)
        }
      } else {
        setDisplayValue(value || '')
      }
    }, [value, type, isFocused])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'money') {
        const numericValue = e.target.value.replace(/[^0-9]/g, '')
        setDisplayValue(numericValue)

        // 실제 값은 숫자만 전달
        if (onChange) {
          const event = {
            ...e,
            target: {
              ...e.target,
              value: numericValue,
            },
          }
          onChange(event)
        }
      } else {
        setDisplayValue(e.target.value)
        onChange?.(e)
      }
    }

    const handleFocus = () => {
      setIsFocused(true)
      if (type === 'money' && value) {
        const numericValue = value.replace(/[^0-9]/g, '')
        setDisplayValue(numericValue)
      }
    }

    const handleBlur = () => {
      setIsFocused(false)
      if (type === 'money' && value) {
        const numericValue = value.replace(/[^0-9]/g, '')
        const formattedValue = new Intl.NumberFormat('ko-KR').format(
          Number(numericValue),
        )
        setDisplayValue(`${formattedValue} 원`)
      }
    }

    return (
      <InputContainer className={className}>
        {label && (
          <Label htmlFor={id}>
            {label}
            {required && <span className="required">*</span>}
          </Label>
        )}
        <StyledInput
          id={id}
          ref={ref}
          disabled={disabled}
          required={required}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          aria-invalid={isError}
          aria-describedby={message ? `${id}-error` : undefined}
          {...props}
        />
        {!isError && validations && (
          <ValidationWrapper>
            {Object.entries(validations || {}).map(([key, validation]) => (
              <ValidationContainer key={key}>
                <Image
                  src={`/icons/validation-${validation.isValid ? 'true' : 'false'}.svg`}
                  alt={
                    validation.isValid ? '유효성 검사 통과' : '유효성 검사 실패'
                  }
                  width={14}
                  height={14}
                />
                <ValidationMessage isValid={validation.isValid}>
                  {validation.message}
                </ValidationMessage>
              </ValidationContainer>
            ))}
          </ValidationWrapper>
        )}
        {isError && message && (
          <ValidationContainer id={`${id}-error`}>
            <Image
              src={`/icons/validation-false.svg`}
              alt={message}
              width={14}
              height={14}
            />
            <ValidationMessage isValid={false}>{message}</ValidationMessage>
          </ValidationContainer>
        )}
      </InputContainer>
    )
  },
)

InputBoxBase.displayName = 'InputBoxBase'

export const InputBox = memo(InputBoxBase)
