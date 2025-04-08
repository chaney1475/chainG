'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { format } from 'date-fns'
import ko from 'date-fns/locale/ko'
import { useRouter } from 'next/navigation'

import { getPaymentCurrentStatus } from '@/apis/payment'
import { AccountHistoryViewer, ConfirmButton, IconButton } from '@/components'
import { useAppSelector, useFormattedDuration } from '@/hooks'
import { setPaymentCurrent } from '@/store/slices/pledgeSlice'
import {
  PaymentCurrent,
  PaymentStatus,
  UserPaymentStatus,
} from '@/types/budget'
import { FormattedAccountPaymentHistory } from '@/types/fintech'
import { ButtonVariant } from '@/types/ui'
import { formatMoney } from '@/utils/format'

import {
  AccountContainer,
  AccountInfo,
  AccountTitle,
  ButtonContainer,
  Container,
  ContentContainer,
  CurrentMonth,
  DashBoardContainer,
  DateContainer,
  MonthNavigation,
  MonthSummary,
  SelectButton,
  SelectContainer,
} from './styles'

export function Account({
  paymentHistory,
  budgetDate,
  setBudgetDate,
  startDate,
  endDate,
}: {
  paymentHistory: FormattedAccountPaymentHistory[]
  budgetDate: Date
  setBudgetDate: (date: Date) => void
  startDate: string
  endDate: string
}) {
  type Filter = 'ALL' | '1' | '2'
  const [selectedFilter, setSelectedFilter] = useState<Filter>('ALL')
  const { t } = useTranslation()
  const accountDetail = useAppSelector(
    (state) => state.pledge.account.accountDetail,
  )
  const dispatch = useDispatch()
  const selectItem: { label: string; value: Filter }[] = [
    {
      label: t('livingBudget.all'),
      value: 'ALL',
    },
    {
      label: t('livingBudget.depositAmount'),
      value: '1',
    },
    {
      label: t('livingBudget.withdrawalAmount'),
      value: '2',
    },
  ]
  const filteredHistory = useMemo(() => {
    if (selectedFilter === 'ALL') return paymentHistory
    return paymentHistory.filter(
      (item) => item.transactionType === selectedFilter,
    )
  }, [paymentHistory, selectedFilter])
  const handleMonth = (direction: number) => () => {
    const newDate = new Date(budgetDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setBudgetDate(newDate)
  }
  const formatMonth = (date: Date) => {
    return `${format(date ?? new Date(), 'LLLL', { locale: ko })}`
  }
  const duration = useFormattedDuration(startDate, endDate)
  const router = useRouter()
  const paymentCurrent = useAppSelector((state) => state.pledge.paymentCurrent)
  const currentMonth = useMemo(() => format(new Date(), 'yyyyMM'), [])
  const user = useAppSelector((state) => state.user.user)
  const hasFetchedPaymentCurrent = useRef(false)
  useEffect(() => {
    const fetchPaymentCurrent = async () => {
      if (hasFetchedPaymentCurrent.current) return
      hasFetchedPaymentCurrent.current = true
      if (!user.contractId) return

      const response = await getPaymentCurrentStatus(currentMonth)
      if (response.success) {
        dispatch(setPaymentCurrent(response.data as PaymentCurrent))
      }
    }
    fetchPaymentCurrent()
  }, [user.contractId, currentMonth, dispatch])

  return (
    <Container>
      <MonthSummary>
        <AccountContainer>
          <AccountTitle>월세 / 공과금 계좌</AccountTitle>
          <AccountInfo>
            <span>{t('fintech.bankName') + ' ' + accountDetail.accountNo}</span>
            <div>{formatMoney(accountDetail.accountBalance)}</div>
          </AccountInfo>
        </AccountContainer>
      </MonthSummary>
      <AccountHistoryViewer filteredHistory={filteredHistory}>
        <ButtonContainer>
          {paymentCurrent?.rent === PaymentStatus.COLLECTED && (
            <ConfirmButton
              onClick={() => {
                router.push('/pledge/transfer/owner')
              }}
              variant={ButtonVariant.prev}
              label="집주인에게 보내기"
            />
          )}

          {paymentCurrent?.userRent === UserPaymentStatus.FAILED && (
            <ConfirmButton
              onClick={() => {
                router.push('/budget/pledge/transfer/rent')
              }}
              variant={ButtonVariant.next}
              label="월세 채우기"
            />
          )}
        </ButtonContainer>
        <DashBoardContainer>
          <MonthNavigation>
            <IconButton
              src={'/icons/arrow-small-left.svg'}
              alt="전월 선택"
              onClick={handleMonth(-1)}
            />
            <CurrentMonth>{formatMonth(budgetDate)}</CurrentMonth>
            <IconButton
              src={'/icons/arrow-small-right.svg'}
              alt="다음월 선택"
              onClick={handleMonth(1)}
            />
          </MonthNavigation>
          <ContentContainer>
            <DateContainer>{duration}</DateContainer>
            <SelectContainer>
              {selectItem.map((item) => (
                <SelectButton
                  key={item.value}
                  isSelected={selectedFilter === item.value}
                  onClick={() => setSelectedFilter(item.value)}>
                  {item.label}
                </SelectButton>
              ))}
            </SelectContainer>
          </ContentContainer>
        </DashBoardContainer>
      </AccountHistoryViewer>
    </Container>
  )
}
