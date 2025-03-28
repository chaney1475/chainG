'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { ConfirmButton } from '@/components/ConfirmButton'
import { TopHeader } from '@/components/TopHeader'
import { lifeRuleList } from '@/constants/lifeRuleList'
import { Container } from '@/styles/styles'
import { LifeRuleUpdateVariant } from '@/types/lifeRule'

import { LifeRuleUpdateListItem } from '../components/LifeRuleUpdateListItem'
import { FullMain, LifeRuleUpdateList } from './styles'

export function LifeRuleUpdateApprovePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [variant, setVariant] = useState<LifeRuleUpdateVariant>('DELETE')
  return (
    <Container>
      <TopHeader title={t('lifeRule.title')} />
      <FullMain>
        <LifeRuleUpdateList>
          <LifeRuleUpdateListItem
            lifeRule={lifeRuleList[0]}
            variant="DEFAULT"
            setVariant={setVariant}
          />
        </LifeRuleUpdateList>
      </FullMain>
      <div>승인페이지</div>
      <ConfirmButton label="완료" />
    </Container>
  )
}
