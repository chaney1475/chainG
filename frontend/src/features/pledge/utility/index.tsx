'use client'

import React from 'react'

import { useAppSelector } from '@/hooks/useAppSelector'
import { Description, EmptyContainer, HeaderTitle } from '@/styles/styles'

import { BottomContainer } from '../styles'
import { Graph } from './components/Graph'
import { Payment } from './components/Payment'
import { Stats } from './components/Stats'
import { Step } from './components/Step'

export function UtilityPage() {
  const utilityInfo = useAppSelector((state) => state.pledge.utility)
  const cardId = useAppSelector(
    (state) => state.contract.contract.utility.cardId,
  )
  return (
    <>
      {cardId && (
        <>
          <Payment />
          {utilityInfo?.weekList && utilityInfo?.weekList.length != 0 && (
            <Graph data={utilityInfo.weekList} />
          )}
          <Stats />
          <Step />
          <BottomContainer />
        </>
      )}
      {cardId == null && (
        <EmptyContainer>
          <HeaderTitle>해당 계좌 거래 내역이 없어요</HeaderTitle>
          <Description>범위를 변경해보세요</Description>
        </EmptyContainer>
      )}
    </>
  )
}
