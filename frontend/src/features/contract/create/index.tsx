'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

import { BottomNavigation, TopHeader } from '@/components'
import { Container } from '@/styles/styles'

import { FullMain } from './styles'

export function ContractCreatePage() {
  const { t } = useTranslation()

  return (
    <Container>
      <TopHeader title={t('contract')} />
      <FullMain></FullMain>
      <BottomNavigation />
    </Container>
  )
}
