import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import styled from '@emotion/styled'

import { createAccount } from '@/apis/payment'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setRentAccountConfirm, updateRent } from '@/store/slices/contractSlice'
import { ShowBox } from '@/styles/styles'

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

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
`

export function AccountInput({
  value,
  onChange,
  isConfirmed,
  onConfirm,
}: AccountInputProps) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState(value || '')
  const dispatch = useDispatch()
  const rentAccountConfirm = useAppSelector(
    (state) => state.contract.rentAccountConfirm,
  )
  const rent = useAppSelector((state) => state.contract.contractRequest.rent)

  const handleConfirm = async () => {
    console.log('handleConfirm')
    const response = await createAccount()
    if (response.success) {
      const accountNo = response.data.data.accountNo
      onChange?.(accountNo)
      dispatch(
        updateRent({
          ...rent,
          rentAccountNo: accountNo,
        }),
      )
      dispatch(setRentAccountConfirm(true))
    }
    console.log(response)
    onConfirm?.()
  }
  return (
    <Container>
      <InputContainer>
        <ShowBox onClick={handleConfirm}>
          {rentAccountConfirm ? t('contract.confirmed') : t('confirm')}
        </ShowBox>
      </InputContainer>
    </Container>
  )
}
