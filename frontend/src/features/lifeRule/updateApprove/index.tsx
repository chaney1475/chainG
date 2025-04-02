'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import { getUpdateLifeRule } from '@/apis/lifeRule'
import { approveUpdateForm } from '@/apis/lifeRule'
import { TopHeader } from '@/components/TopHeader'
import { lifeRuleList } from '@/constants/lifeRuleList'
import ApproveModal from '@/features/lifeRule/components/ApproveModal'
import { ApproveProfile } from '@/features/lifeRule/components/ApproveProfile'
import { LifeRuleUpdateApproveListItem } from '@/features/lifeRule/components/LifeRuleUpdateApproveListItem'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setUpdateLifeRules } from '@/store/slices/lifeRuleSlice'
import { Container } from '@/styles/styles'

// import { LifeRuleUpdateVariant } from '@/types/lifeRule'

import { ApproveButton } from '../components/ApproveButton'
// import UpdateModal from '../components/UpdateModal'
import { ConfirmContainer } from '../update/styles'
import { ApproveProfileContainer, FullMain, LifeRuleUpdateList } from './styles'

// // 예시 데이터
// const sampleItems: Array<{
//   id: number
//   rule: (typeof lifeRuleList)[0]
//   variant: LifeRuleUpdateVariant
// }> = [
//   {
//     id: 1,
//     rule: {
//       ...lifeRuleList[0],
//       content: '토요일은 대청소의 날',
//     },
//     variant: 'DEFAULT',
//   },
//   {
//     id: 2,
//     rule: {
//       ...lifeRuleList[0],
//       content: '미리미의 생활규칙',
//     },
//     variant: 'UPDATE',
//   },
//   {
//     id: 3,
//     rule: {
//       ...lifeRuleList[0],
//       content: '새로운 생활규칙',
//     },
//     variant: 'CREATE',
//   },
//   {
//     id: 4,
//     rule: {
//       ...lifeRuleList[0],
//       content: '삭제할 생활규칙',
//     },
//     variant: 'DELETE',
//   },
// ]

export function LifeRuleUpdateApprovePage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const router = useRouter()
  const updateLifeRules = useAppSelector(
    (state) => state.lifeRule.updateLifeRules,
  )
  const [selectedProfileId, setSelectedProfileId] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [approveType, setApproveType] = useState<'approve' | 'reject' | null>(
    null,
  )

  const handleProfileSelect = (id: string) => {
    setSelectedProfileId(id)
  }

  const handleApprove = async () => {
    setApproveType('approve')
    setIsModalOpen(true)
  }

  const handleReject = async () => {
    setApproveType('reject')
    setIsModalOpen(true)
  }

  const handleModalConfirm = async () => {
    try {
      const response = await approveUpdateForm({
        approved: approveType === 'approve',
      })
      if (response) {
        router.push('/lifeRule')
      }
      console.log('response', response)
    } catch (error) {
      console.error('Error in approval process:', error)
    }
    setIsModalOpen(false)
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

      <ApproveModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleModalConfirm}
        title={approveType === 'approve' ? '생활 규칙 승인' : '생활 규칙 거부'}
        description={
          approveType === 'approve'
            ? '생활 규칙 수정 확인하셨나요?\n모두가 승인 버튼을 누르면 적용됩니다!'
            : '바뀐 생활규칙을 거부하실건가요?\n거부버튼을 누르면 기존의 생활규칙이 유지됩니다'
        }
        confirmText={approveType === 'approve' ? '확인' : '확인'}
        image={
          approveType === 'approve'
            ? '/images/lifeRule/approve.svg'
            : '/images/lifeRule/approve.svg'
        }
      />
    </Container>
  )
}
