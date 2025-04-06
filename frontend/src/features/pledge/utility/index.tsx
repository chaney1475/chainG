'use client'

import React, { useEffect, useState  } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'
import { Payment } from './components/Payment'
import { Stats } from './components/Stats'
import { Graph } from './components/Graph'
import { BottomContainer } from '../styles'

export function UtilityPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const router = useRouter()



  return (
    <>
    <Payment/>
    <Graph/>
    <Stats/>
    <BottomContainer/> 
    </>
  ) 
}
