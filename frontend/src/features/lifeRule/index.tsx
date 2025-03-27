'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { lifeRuleList } from '@/constants/lifeRuleList'
import { TopHeader } from '@/features/lifeRule/components/TopHeader'
import { Container } from '@/styles/styles'

import { LifeRuleList } from './components/LifeRuleList'
import { FullMain, NavigatorBar } from './styles'

export function LifeRulePage() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Container>
      <TopHeader title={t('lifeRule.title')} />
      <FullMain>
        <LifeRuleList lifeRuleList={lifeRuleList} />
      </FullMain>
      <NavigatorBar></NavigatorBar>
    </Container>
  )
}
