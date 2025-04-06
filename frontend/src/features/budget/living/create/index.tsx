'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import styled from '@emotion/styled'
import Image from 'next/image'

import { createAccount } from '@/apis/fintech'
import { saveAccountAndNotify } from '@/apis/livingBudget'
import { TitleHeaderLayout } from '@/components'
import { useAppSelector, useIsLeader } from '@/hooks'
import { setLivingAccountNo } from '@/store/slices/livingBudgetSlice'
import {
  ShowCenterBox,
  ValidationContainer,
  ValidationMessage,
} from '@/styles/styles'
import { ButtonVariant } from '@/types/ui'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0;
`

export function BudgetLivingCreatePage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const livingAccountNo = useAppSelector(
    (state) => state.livingBudget.livingAccountNo,
  )
  const rentAccountConfirm = useAppSelector(
    (state) => state.contract.rentAccountConfirm,
  )
  const rent = useAppSelector((state) => state.contract.contractRequest.rent)
  const group = useAppSelector((state) => state.group.group)
  const isLeader = useIsLeader()
  const [next, setNext] = useState(false)
  const disabled = !!livingAccountNo || !isLeader

  useEffect(() => {
    if (next && !disabled) {
      handleConfirm()
    }
  }, [next])

  const handleConfirm = async () => {
    const response = await createAccount()
    if (response.success) {
      const accountNo = response.data.data.accountNo
      const success = await saveAccountAndNotify(accountNo)
      if (success) {
        dispatch(setLivingAccountNo(accountNo))
      }
    }
  }
  const [buttonText, setButtonText] = useState(
    t('contract.rentAccountNo.button'),
  )

  const leaderName = group.members.find(
    (info) => info.id == group.leaderId,
  )?.name

  useEffect(() => {
    const content = rentAccountConfirm
      ? t('fintech.bankName') + ' ' + rent.rentAccountNo + ' ' + leaderName
      : '생활비 계좌 개설'
    setButtonText(content)
  }, [livingAccountNo, leaderName, t])

  const handleNext = () => {
    setNext(true)
  }

  return (
    <TitleHeaderLayout
      title="생활비"
      label="완료"
      onClick={handleNext}
      buttonVariant={ButtonVariant.next}>
      <Container>
        <ShowCenterBox
          onClick={() => setNext(true)}
          isDisabled={disabled}>
          {buttonText}
        </ShowCenterBox>

        {!isLeader && !livingAccountNo && (
          <ValidationContainer>
            <Image
              src={`/icons/validation-false.svg`}
              alt={'message'}
              width={14}
              height={14}
            />
            <ValidationMessage isValid={false}>
              {t('contract.rentAccountNo.validation.leaderOnly')}
            </ValidationMessage>
          </ValidationContainer>
        )}
      </Container>
    </TitleHeaderLayout>
  )
}
