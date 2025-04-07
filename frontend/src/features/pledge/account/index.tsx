'use client'

import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { format } from 'date-fns'
import ko from 'date-fns/locale/ko'
import { useRouter } from 'next/navigation'

import { AccountHistoryViewer, ConfirmButton, IconButton } from '@/components'
import { CurrentMonth } from '@/features/budget/living/component/BudgetCalendar/styles'
import { MonthNavigation } from '@/features/budget/living/component/BudgetCalendar/styles'
import { MonthSummary } from '@/features/budget/living/component/BudgetCalendar/styles'
import { useFormattedDuration } from '@/hooks'
import { DefaultContainer } from '@/styles/styles'
import { FormattedAccountPaymentHistory } from '@/types/fintech'
import { ButtonVariant } from '@/types/ui'

import {
  ButtonContainer,
  ContentContainer,
  DateContainer,
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
  return (
    <DefaultContainer>
      <MonthSummary>
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
      </MonthSummary>
      <AccountHistoryViewer filteredHistory={filteredHistory}>
        <ButtonContainer>
          <ConfirmButton
            onClick={() => {}}
            variant={ButtonVariant.prev}
            label="집주인에게 보내기"
          />
          <ConfirmButton
            onClick={() => {
              router.push('/budget/living/withdraw')
            }}
            variant={ButtonVariant.next}
            label="월세 채우기"
          />
        </ButtonContainer>
        <DateContainer>{duration}</DateContainer>
        <ContentContainer>
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
      </AccountHistoryViewer>
    </DefaultContainer>
  )
}
