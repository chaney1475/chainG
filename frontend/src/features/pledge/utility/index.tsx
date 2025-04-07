'use client'

import React from 'react'

import { BottomContainer } from '../styles'
import { Graph } from './components/Graph'
import { Payment } from './components/Payment'
import { Stats } from './components/Stats'

export function UtilityPage() {
  return (
    <>
      <Payment />
      <Graph />
      <Stats />
      <BottomContainer />
    </>
  )
}
