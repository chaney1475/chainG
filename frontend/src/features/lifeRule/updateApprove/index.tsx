'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import {
  approveUpdateForm,
  getLifeRule,
  getUpdateLifeRule,
  postNotApprovedIds,
} from '@/apis/lifeRule'
import { TopHeader } from '@/components/TopHeader'
import ApproveModal from '@/features/lifeRule/components/ApproveModal'
import { ApproveProfile } from '@/features/lifeRule/components/ApproveProfile'
import { LifeRuleUpdateApproveListItem } from '@/features/lifeRule/components/LifeRuleUpdateApproveListItem'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setUpdateLifeRules } from '@/store/slices/lifeRuleSlice'
import { setHomeOverviewLifeRuleApproved } from '@/store/slices/userSlice'
import { Container } from '@/styles/styles'
import { LifeRuleUpdateVariant, UpdateLifeRule } from '@/types/lifeRule'

import { ApproveButton } from '../components/ApproveButton'
import { ConfirmContainer } from '../update/styles'
import { ApproveProfileContainer, FullMain, LifeRuleUpdateList } from './styles'

// 수정된 부분 - 업데이트된 규칙에 대한 타입 정의
export function LifeRuleUpdateApprovePage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const router = useRouter()
  const groupId = useAppSelector((state) => state.group.group.id)
  const updateLifeRules = useAppSelector(
    (state) => state.lifeRule.updateLifeRules,
  )
  const user = useAppSelector((state) => state.user.user)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [approveType, setApproveType] = useState<'approve' | 'reject' | null>(
    null,
  )
  const [mergedLifeRules, setMergedLifeRules] = useState<UpdateLifeRule[]>([])

  // 승인/거부 처리 함수
  const handleApprovalUpdate = async (approved: boolean) => {
    try {
      if (user?.id) {
        const approveResponse = await approveUpdateForm({ approved })
        if (approveResponse === true) {
          router.push('/lifeRule')
          if (!approved) {
            dispatch(setHomeOverviewLifeRuleApproved(false))
          } else {
            const postNotApprovedIdsResponse = await postNotApprovedIds(groupId)
            console.log(
              'postNotApprovedIdsResponse',
              postNotApprovedIdsResponse,
            )
            if (
              postNotApprovedIdsResponse.success &&
              postNotApprovedIdsResponse.data.notApprovedIds?.length === 0
            ) {
              dispatch(setHomeOverviewLifeRuleApproved(false))
            }
          }
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
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error in approval process:', error)
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      try {
        // 기존 생활규칙 목록 가져오기
        const lifeRuleResponse = await getLifeRule()
        if (lifeRuleResponse.success) {
          // 기본 규칙들에 actionType을 'DEFAULT'로 설정
          const baseRules = lifeRuleResponse.data.lifeRules.map((rule) => ({
            ...rule,
            actionType: 'DEFAULT' as LifeRuleUpdateVariant, // 명시적으로 타입 설정
          }))

          // 변경 요청된 생활규칙 목록 가져오기
          const updateResponse = await getUpdateLifeRule()
          if (updateResponse.success) {
            dispatch(setUpdateLifeRules(updateResponse.data))

            // 기존 규칙과 업데이트된 규칙 병합
            const mergedRules: UpdateLifeRule[] = [...baseRules]

            // 업데이트된 규칙들 처리
            updateResponse.data.forEach((updateRule) => {
              const existingIndex = mergedRules.findIndex(
                (rule) => rule.id === updateRule.id,
              )
              if (existingIndex !== -1) {
                // 기존 규칙 업데이트
                mergedRules[existingIndex] = {
                  ...updateRule,
                  id: updateRule.id || mergedRules[existingIndex].id,
                  actionType: updateRule.actionType || 'DEFAULT', // actionType을 정확히 설정
                }
              } else {
                // 새로운 규칙 추가
                const maxId = Math.max(
                  ...mergedRules.map((rule) => rule.id || 0),
                  0,
                )
                mergedRules.push({
                  ...updateRule,
                  id: updateRule.id || maxId + 1,
                  actionType: updateRule.actionType || 'DEFAULT', // actionType을 정확히 설정
                })
              }
            })

            setMergedLifeRules(mergedRules)
          }
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
          {mergedLifeRules.map((item) => (
            <LifeRuleUpdateApproveListItem
              key={item.id}
              lifeRule={item}
              variant={
                updateLifeRules.find((updateRule) => updateRule.id === item.id)
                  ?.actionType || 'DEFAULT'
              }
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
