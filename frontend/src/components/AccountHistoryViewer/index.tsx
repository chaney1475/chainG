'use client'

import React from 'react'

import {
  DefaultLabel,
  Description,
  EmptyContainer,
  HeaderTitle,
  PaddingContainer,
  SlimContainer,
  TitleContainer,
} from '@/styles/styles'
import { FormattedAccountPaymentHistory } from '@/types/fintech'

import {
  AccountHistoryContainer,
  AccountHistoryContent,
  Container,
  ContentContainer,
} from './styles'

export function AccountHistoryViewer({
  filteredHistory,
  children,
}: {
  filteredHistory: FormattedAccountPaymentHistory[]
  children: React.ReactNode
}) {
  const formatDate = (date: string) => {
    const month = Number(date.slice(5, 7))
    const day = Number(date.slice(8, 10))
    return `${month}.${day}`
  }

  return (
    <Container>
      <ContentContainer>
        {children}
        <PaddingContainer>
          {filteredHistory &&
            filteredHistory.map((item) => (
              <SlimContainer key={item.transactionUniqueNo}>
                <AccountHistoryContainer>
                  {item.showDate && <span>{formatDate(item.date)}</span>}
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
