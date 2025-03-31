'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

// import { useRouter } from 'next/navigation'

import { ConfirmButton } from '@/components/ConfirmButton'
import { TopHeader } from '@/components/TopHeader'
import { lifeRuleList } from '@/constants/lifeRuleList'
import { ApproveProfile } from '@/features/lifeRule/components/ApproveProfile'
import { Container } from '@/styles/styles'
import { LifeRuleUpdateVariant } from '@/types/lifeRule'

import { LifeRuleUpdateListItem } from '../components/LifeRuleUpdateListItem'
import { ConfirmContainer } from '../update/styles'
import { ApproveProfileContainer, FullMain, LifeRuleUpdateList } from './styles'

export function LifeRuleUpdateApprovePage() {
  const { t } = useTranslation()
  // const router = useRouter()
  const [variant, setVariant] = useState<LifeRuleUpdateVariant>('DELETE')
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
          <LifeRuleUpdateListItem
            lifeRule={lifeRuleList[0]}
            variant={variant}
            setVariant={setVariant}
            onContentChange={() => {}}
          />
        </LifeRuleUpdateList>
      </FullMain>
      <ConfirmContainer>
        <ConfirmButton label="완료" />
      </ConfirmContainer>
    </Container>
  )
}
