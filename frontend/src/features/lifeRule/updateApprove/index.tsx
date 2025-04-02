'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import { approveUpdateForm, getUpdateLifeRule } from '@/apis/lifeRule'
import { TopHeader } from '@/components/TopHeader'
import ApproveModal from '@/features/lifeRule/components/ApproveModal'
import { ApproveProfile } from '@/features/lifeRule/components/ApproveProfile'
import { LifeRuleUpdateApproveListItem } from '@/features/lifeRule/components/LifeRuleUpdateApproveListItem'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setUpdateLifeRules } from '@/store/slices/lifeRuleSlice'
import { Container } from '@/styles/styles'
import { UpdateLifeRule } from '@/types/lifeRule'

// import { LifeRule, LifeRuleUpdateVariant } from '@/types/lifeRule'

// import { LifeRuleUpdateVariant } from '@/types/lifeRule'

import { ApproveButton } from '../components/ApproveButton'
// import UpdateModal from '../components/UpdateModal'
import { ConfirmContainer } from '../update/styles'
import { ApproveProfileContainer, FullMain, LifeRuleUpdateList } from './styles'

// interface UpdateLifeRule extends LifeRule {
//   actionType: LifeRuleUpdateVariant
// }

// 나중에 API 응답 타입으로 교체될 인터페이스
// interface ApprovalStatus {
//   isCreator: boolean
//   hasApproved: boolean
// }

export function LifeRuleUpdateApprovePage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const router = useRouter()
  const updateLifeRules = useAppSelector(
    (state) => state.lifeRule.updateLifeRules,
  )
  const user = useAppSelector((state) => state.user.user)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [approveType, setApproveType] = useState<'approve' | 'reject' | null>(
    null,
  )

  // 승인/거부 처리 함수
  const handleApprovalUpdate = async (approved: boolean) => {
    try {
      if (user?.id) {
        const approveResponse = await approveUpdateForm({ approved })
        if (approveResponse === true) {
          setIsModalOpen(false)
          router.push('/lifeRule')
        }
      }
    } catch (error) {
      console.error('Error updating approval:', error)
    }
  }

  const handleApprove = () => {
    setApproveType('approve')
    setIsModalOpen(true)
  }

  const handleReject = () => {
    setApproveType('reject')
    setIsModalOpen(true)
  }

  const handleModalConfirm = async () => {
    try {
      await handleApprovalUpdate(approveType === 'approve')
    } catch (error) {
      console.error('Error in approval process:', error)
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      try {
        // 변경 요청된 생활규칙 목록 가져오기
        const response = await getUpdateLifeRule()
        if (response.success) {
          dispatch(setUpdateLifeRules(response.data))
        }
      } catch (error) {
        console.error('Error initializing data:', error)
      }
    }

    initializeData()
  }, [dispatch])

  return (
    <Container>
      <TopHeader title={t('lifeRule.updateApproveTitle')} />
      <FullMain>
        <ApproveProfileContainer>
          <ApproveProfile />
        </ApproveProfileContainer>
        <LifeRuleUpdateList>
          {updateLifeRules.map((item: UpdateLifeRule) => (
            <LifeRuleUpdateApproveListItem
              key={item.id}
              lifeRule={item}
              variant={item.actionType || 'DEFAULT'}
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
            : '/images/lifeRule/reject.svg'
        }
      />
    </Container>
  )
}
