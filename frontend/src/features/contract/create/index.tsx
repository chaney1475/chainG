'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BottomNavigation, ProgressBar, TopHeader } from '@/components'
import { Container } from '@/styles/styles'

import { FullMain } from './styles'

export function ContractCreatePage() {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  return (
    <Container>
      <TopHeader title={t('contract')} />
      <FullMain>
        <ProgressBar
          step={step}
          steps={6}
        />
        <button onClick={() => setStep(Math.min(step + 1, 6))}>next</button>
      </FullMain>
      <BottomNavigation />
    </Container>
  )
}
