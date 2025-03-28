'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { lifeRuleList } from '@/constants/lifeRuleList'
import { TopHeader } from '@/features/lifeRule/components/TopHeader'
import { Container } from '@/styles/styles'

import { LifeRuleList } from './components/LifeRuleList'
import { NoticeBar } from './components/NoticeBar'
import { FullMain, NavigatorBar } from './styles'

export function LifeRulePage() {
  const { t } = useTranslation()
  const router = useRouter()

  const [isUpdated, setIsUpdated] = useState<boolean>(false)

  const handleUpdateRules = () => {
    setIsUpdated((prevState) => !prevState)
  }

  return (
    <Container>
      <TopHeader title={t('lifeRule.title')} />
      <FullMain>
        {isUpdated && <NoticeBar message={t('lifeRule.updateMessage')} />}
        <LifeRuleList lifeRuleList={lifeRuleList} />
        {/* 임시 상태변경 버튼 */}
        <button onClick={handleUpdateRules}>생활 규칙 수정</button>
      </FullMain>
      <NavigatorBar></NavigatorBar>
    </Container>
  )
}
