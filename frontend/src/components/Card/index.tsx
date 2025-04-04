import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import styled from '@emotion/styled'

import { createCard } from '@/apis/payment'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setCardConfirm, updateUtility } from '@/store/slices/contractSlice'
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

export function Card({
  value,
  onChange,
  isConfirmed,
  onConfirm,
}: AccountInputProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const cardConfirm = useAppSelector((state) => state.contract.cardConfirm)
  const rent = useAppSelector((state) => state.contract.contractRequest.rent)

  const handleConfirm = async () => {
    console.log('handleConfirm')
    const response = await createCard({ accountNo: rent.rentAccountNo })
    if (response.success) {
      const cardId = response.data.id
      onChange?.(cardId)
      dispatch(
        updateUtility({
          cardId: Number(cardId),
        }),
      )
      dispatch(setCardConfirm(true))
    }
    console.log(response)
    onConfirm?.()
  }
  return (
    <Container>
      <InputContainer>
        <ShowBox onClick={handleConfirm}>
          {cardConfirm ? t('contract.confirmed') : t('confirm')}
        </ShowBox>
      </InputContainer>
    </Container>
  )
}
