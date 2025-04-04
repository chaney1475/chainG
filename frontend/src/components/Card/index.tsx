import { useState } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import styled from '@emotion/styled'
import Image from 'next/image'

import { createCard } from '@/apis/fintech'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setCardConfirm, updateUtility } from '@/store/slices/contractSlice'
import {
  ShowCenterBox,
  SlimContainer,
  ValidationContainer,
  ValidationMessage,
} from '@/styles/styles'

interface AccountInputProps {
  value?: string
  onChange?: (value: string) => void
  label?: string
  isConfirmed?: boolean
  onConfirm?: () => void
}

export function Card({ onChange }: AccountInputProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const cardConfirm = useAppSelector((state) => state.contract.cardConfirm)
  const rent = useAppSelector((state) => state.contract.contractRequest.rent)
  const user = useAppSelector((state) => state.user.user)
  const group = useAppSelector((state) => state.group.group)
  const isLeader = group?.leaderId === user.id
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
    const content = cardConfirm
      ? t('fintech.bankName') + ' ' + t('fintech.cardName')
      : t('contract.utility.button')
    setButtonText(content)
  }, [cardConfirm, t])
  return (
    <SlimContainer>
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
    </SlimContainer>
  )
}
