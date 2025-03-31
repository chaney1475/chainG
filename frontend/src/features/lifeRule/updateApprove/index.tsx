'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

// import { useRouter } from 'next/navigation'

import { TopHeader } from '@/components/TopHeader'
import { lifeRuleList } from '@/constants/lifeRuleList'
import { ApproveProfile } from '@/features/lifeRule/components/ApproveProfile'
import { LifeRuleUpdateApproveListItem } from '@/features/lifeRule/components/LifeRuleUpdateApproveListItem'
import { Container } from '@/styles/styles'
import { LifeRuleUpdateVariant } from '@/types/lifeRule'

import { ApproveButton } from '../components/ApproveButton'
import { ConfirmContainer } from '../update/styles'
import { ApproveProfileContainer, FullMain, LifeRuleUpdateList } from './styles'

// 예시 데이터
const sampleItems: Array<{
  id: number
  rule: (typeof lifeRuleList)[0]
  variant: LifeRuleUpdateVariant
}> = [
  {
    id: 1,
    rule: {
      ...lifeRuleList[0],
      content: '토요일은 대청소의 날',
    },
    variant: 'DEFAULT',
  },
  {
    id: 2,
    rule: {
      ...lifeRuleList[0],
      content: '미리미의 생활규칙',
    },
    variant: 'UPDATE',
  },
  {
    id: 3,
    rule: {
      ...lifeRuleList[0],
      content: '새로운 생활규칙',
    },
    variant: 'CREATE',
  },
  {
    id: 4,
    rule: {
      ...lifeRuleList[0],
      content: '삭제할 생활규칙',
    },
    variant: 'DELETE',
  },
]

export function LifeRuleUpdateApprovePage() {
  const { t } = useTranslation()
  // const router = useRouter()
  const [selectedProfileId, setSelectedProfileId] = useState('')

  const handleProfileSelect = (id: string) => {
    setSelectedProfileId(id)
  }

  return (
    <Container>
      <TopHeader title={t('lifeRule.updateApproveTitle')} />
      <FullMain>
        <ApproveProfileContainer>
          <ApproveProfile
            selectedId={selectedProfileId}
            onSelect={handleProfileSelect}
          />
        </ApproveProfileContainer>
        <LifeRuleUpdateList>
          {sampleItems.map((item) => (
            <LifeRuleUpdateApproveListItem
              key={item.id}
              lifeRule={item.rule}
              variant={item.variant}
            />
          ))}
        </LifeRuleUpdateList>
      </FullMain>
      <ConfirmContainer>
        <ApproveButton />
      </ConfirmContainer>
    </Container>
  )
}
