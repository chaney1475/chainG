'use client'

import React from 'react'

import { useAppSelector } from '@/hooks/useAppSelector'

import { BottomContainer } from '../styles'
import { Graph } from './components/Graph'
import { Payment } from './components/Payment'
import { Stats } from './components/Stats'
import { Step } from './components/Step'

export function UtilityPage() {
  const utilityInfo = useAppSelector((state) => state.pledge.utility)
  return (
    <>
      <Payment />
      {utilityInfo?.weekList && utilityInfo?.weekList.length != 0 && (
        <Graph data={utilityInfo.weekList} />
      )}
      <Stats />
      <Step />
      <BottomContainer />
    </>
  )
}
