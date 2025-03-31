'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { BottomNavigation } from '@/components/BottomNavigation'
import { lifeRuleList } from '@/constants/lifeRuleList'
import { TopHeader } from '@/features/lifeRule/components/TopHeader'
import UpdateModal from '@/features/lifeRule/components/UpdateModal'
import { Container } from '@/styles/styles'

import { LifeRuleList } from './components/LifeRuleList'
import { NoticeBar } from './components/NoticeBar'
import { FullMain } from './styles'

export function LifeRulePage() {
  const { t } = useTranslation()
  const router = useRouter()

  const [isUpdated, setIsUpdated] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleUpdateRules = () => {
    setIsUpdated((prevState) => !prevState)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <Container>
      <TopHeader
        title={t('lifeRule.title')}
        isUpdated={isUpdated}
        handleOpenModal={handleOpenModal}
      />
      <FullMain>
        {/* 임시 상태변경 버튼 */}
        <button onClick={handleUpdateRules}>생활 규칙 수정</button>

        {isUpdated && <NoticeBar message={t('lifeRule.updateMessage')} />}
        <LifeRuleList lifeRuleList={lifeRuleList} />
      </FullMain>

      <UpdateModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        onConfirm={handleCloseModal}
        // title="생활 규칙 승인"
        // description="기존에 수정된 항목이 존재합니다. 승인을 하셔야 수정이 가능합니다."
        // confirmText="확인"
      />

      <BottomNavigation />
    </Container>
  )
}
