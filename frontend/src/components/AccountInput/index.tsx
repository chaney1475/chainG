import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import styled from '@emotion/styled'

interface AccountInputProps {
  value?: string
  onChange?: (value: string) => void
  label?: string
  isConfirmed?: boolean
  onConfirm?: () => void
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
`

const Label = styled.label`
  font-size: 14px;
  color: #666;
`

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
`

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #007aff;
  }
`

const ConfirmButton = styled.button<{ disabled: boolean }>`
  padding: 12px 24px;
  background-color: ${({ disabled }) => (disabled ? '#ccc' : '#007AFF')};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

export function AccountInput({
  value,
  onChange,
  label,
  isConfirmed,
  onConfirm,
}: AccountInputProps) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState(value || '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '')
    setInputValue(newValue)
    onChange?.(newValue)
  }

  return (
    <Container>
      <InputContainer>
        <Input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={t('contract.enterAccountNumber')}
          maxLength={14}
        />
        <ConfirmButton
          disabled={!inputValue || isConfirmed}
          onClick={onConfirm}>
          {isConfirmed ? t('contract.confirmed') : t('contract.confirm')}
        </ConfirmButton>
      </InputContainer>
    </Container>
  )
}
