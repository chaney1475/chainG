'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { getUpdateLifeRule } from '@/apis/lifeRule'
// import { useRouter } from 'next/navigation'
import { approveUpdateForm } from '@/apis/lifeRule'
import { TopHeader } from '@/components/TopHeader'
import { lifeRuleList } from '@/constants/lifeRuleList'
import { ApproveProfile } from '@/features/lifeRule/components/ApproveProfile'
import { LifeRuleUpdateApproveListItem } from '@/features/lifeRule/components/LifeRuleUpdateApproveListItem'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setUpdateLifeRules } from '@/store/slices/lifeRuleSlice'
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
  const dispatch = useDispatch()
  const updateLifeRules = useAppSelector(
    (state) => state.lifeRule.updateLifeRules,
  )
  // const router = useRouter()
  const [selectedProfileId, setSelectedProfileId] = useState('')

  const handleProfileSelect = (id: string) => {
    setSelectedProfileId(id)
  }

  const handleApprove = async () => {
    const response = await approveUpdateForm({ approved: true })
    console.log('approve', response)
  }

  useEffect(() => {
    const fetchUpdateLifeRule = async () => {
      const response = await getUpdateLifeRule()
      if (response.success) {
        dispatch(setUpdateLifeRules(response.data))
      }
      console.log('response', response)
    }
    fetchUpdateLifeRule()
  }, [])
  const handleReject = async () => {
    const response = await approveUpdateForm({ approved: false })
    console.log('reject', response)
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
          {updateLifeRules.map((item) => (
            <LifeRuleUpdateApproveListItem
              key={item.id}
              content={item.content}
              lifeRule={item || lifeRuleList[0]}
              variant={item?.actionType || 'DEFAULT'}
            />
          ))}
        </LifeRuleUpdateList>
      </FullMain>
      <ConfirmContainer>
        <ApproveButton
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </ConfirmContainer>
    </Container>
  )
}
