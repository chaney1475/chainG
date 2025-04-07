'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import { useAppSelector } from '@/hooks/useAppSelector'

import { BottomContainer } from '../styles'
import { Graph } from './components/Graph'
import { Payment } from './components/Payment'
import { Stats } from './components/Stats'
import { Step } from './components/Step'

export function RentPage() {
  const rentInfo = useAppSelector((state) => state.pledge.rent)

  return (
    <>
      <Payment />
      <Graph data={rentInfo?.currentMonth || []} />
      <Stats />
      <Step/>
      <BottomContainer />
    </>
  )
}
