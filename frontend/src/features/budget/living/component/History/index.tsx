'use client'

import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { ConfirmButton } from '@/components/ConfirmButton'
import { DefaultLabel } from '@/features/contract/detail/component/ContractViewer/styles'
import { useFormattedDuration } from '@/hooks'
import {
  Description,
  HeaderTitle,
  PaddingContainer,
  SlimContainer,
  TitleContainer,
} from '@/styles/styles'
import { FormattedAccountPaymentHistory } from '@/types/fintech'
import { ButtonVariant } from '@/types/ui'

import {
  AccountHistoryContainer,
  AccountHistoryContent,
  ButtonContainer,
  Container,
  ContentContainer,
  DateContainer,
  EmptyContainer,
  SelectButton,
  SelectContainer,
} from './styles'

export function History({
  paymentHistory,
  startDate,
  endDate,
}: {
  paymentHistory: FormattedAccountPaymentHistory[]
  startDate: string
  endDate: string
}) {
  type Filter = 'ALL' | '1' | '2'
  const [selectedFilter, setSelectedFilter] = useState<Filter>('ALL')

  const selectItem: { label: string; value: Filter }[] = [
    {
      label: '전체',
      value: 'ALL',
    },
    {
      label: '입금',
      value: '1',
    },
    {
      label: '출금',
      value: '2',
    },
  ]
  const filteredHistory = useMemo(() => {
    if (selectedFilter === 'ALL') return paymentHistory
    return paymentHistory.filter(
      (item) => item.transactionType === selectedFilter,
    )
  }, [paymentHistory, selectedFilter])

  const formatDate = (date: string) => {
    const month = Number(date.slice(5, 7))
    const day = Number(date.slice(8, 10))
    return `${month}.${day}`
  }

  const duration = useFormattedDuration(startDate, endDate)
  const router = useRouter()
  return (
    <Container>
      <ButtonContainer>
        <ConfirmButton
          onClick={() => {
            router.push('/budget/living/deposit')
          }}
          variant={ButtonVariant.prev}
          label="채우기"
        />
        <ConfirmButton
          onClick={() => {
            router.push('/budget/living/withdraw')
          }}
          variant={ButtonVariant.next}
          label="꺼내기"
        />
      </ButtonContainer>
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
        <PaddingContainer>
          {filteredHistory &&
            filteredHistory.map((item) => (
              <SlimContainer key={item.transactionUniqueNo}>
                <AccountHistoryContainer>
                  <span>{item.showDate && formatDate(item.date)}</span>
                  <AccountHistoryContent>
                    <TitleContainer>
                      <HeaderTitle>
                        {item.transactionMemo + item.transactionSummary}
                      </HeaderTitle>
                      <DefaultLabel>{item.title}</DefaultLabel>
                    </TitleContainer>
                    <TitleContainer>
                      <Description>{item.time}</Description>
                      <Description>{item.transactionAfterBalance}</Description>
                    </TitleContainer>
                  </AccountHistoryContent>
                </AccountHistoryContainer>
              </SlimContainer>
            ))}
        </PaddingContainer>
        {filteredHistory.length === 0 && (
          <EmptyContainer>
            <HeaderTitle>해당 계좌 거래 내역이 없어요</HeaderTitle>
            <Description>범위를 변경해보세요</Description>
          </EmptyContainer>
        )}
      </ContentContainer>
    </Container>
  )
}
