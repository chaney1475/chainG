import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { createCard } from '@/apis/fintech'
import { Image } from '@/components'
import { useAppSelector, useIsLeader } from '@/hooks'
import { setCardConfirm, updateUtility } from '@/store/slices/contractSlice'
import {
  DefaultContainer,
  ShowCenterBox,
  ValidationContainer,
  ValidationMessage,
} from '@/styles/styles'

interface AccountInputProps {
  value?: string | null
  onChange?: (value: string) => void
  label?: string
  isConfirmed?: boolean
  onConfirm?: () => void
}

export function Card({ onChange }: AccountInputProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const cardConfirm = useAppSelector((state) => state.contract.cardConfirm)
  const utility = useAppSelector(
    (state) => state.contract.contractRequest.utility,
  )
  const useUtilityCard = useAppSelector(
    (state) => state.contract.useUtilityCard,
  )
  const rent = useAppSelector((state) => state.contract.contractRequest.rent)
  const isLeader = useIsLeader()
  const [next, setNext] = useState(false)
  const disabled = cardConfirm || !isLeader
  const [buttonText, setButtonText] = useState(t('contract.utility.button'))
  useEffect(() => {
    if (next && !disabled) {
      handleConfirm()
    }
  }, [next])

  const handleConfirm = async () => {
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
  }
  useEffect(() => {
    if (utility.cardId) {
      dispatch(setCardConfirm(true))
    }
  }, [utility.cardId])
  useEffect(() => {
    const content = cardConfirm
      ? t('fintech.bankName') + ' ' + t('fintech.cardName')
      : t('contract.utility.button')
    setButtonText(content)
  }, [cardConfirm, t])
  return (
    <>
      {useUtilityCard && (
        <DefaultContainer>
          <ShowCenterBox
            onClick={() => setNext(true)}
            isDisabled={disabled}>
            {buttonText}
          </ShowCenterBox>
          {!isLeader && !cardConfirm && (
            <ValidationContainer>
              <Image
                src={`/icons/validation-false.svg`}
                alt={'message'}
                width={14}
                height={14}
              />
              <ValidationMessage isValid={false}>
                {t('contract.utility.validation.leaderOnly')}
              </ValidationMessage>
            </ValidationContainer>
          )}
        </DefaultContainer>
      )}
    </>
  )
}
