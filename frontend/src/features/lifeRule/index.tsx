'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { createLifeRule, getLifeRule } from '@/apis/lifeRule'
import { ConfirmButton } from '@/components'
import { BottomNavigation } from '@/components/BottomNavigation'
import { TopHeader } from '@/features/lifeRule/components/TopHeader'
import UpdateModal from '@/features/lifeRule/components/UpdateModal'
import { setLifeRules } from '@/store/slices/lifeRuleSlice'
import { Container } from '@/styles/styles'
//import { useRouter } from 'next/navigation'
import { LifeRule } from '@/types/lifeRule'

import { LifeRuleList } from './components/LifeRuleList'
import { NoticeBar } from './components/NoticeBar'
import { Description, EmptyContainer, FullMain, TitleContainer } from './styles'

export function LifeRulePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()

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

  const [lifeRuleList, setLifeRuleList] = useState<LifeRule[]>([])
  const [isEmpty, setIsEmpty] = useState<boolean>(false)

  const handleCreate = async () => {
    const response = await createLifeRule({ rules: [] })
    console.log('response🔥', response)
    if (response.success) {
      router.push('/lifeRule/update')
    }
  }

  useEffect(() => {
    console.log('lifeRuleList🔥', lifeRuleList)
    const fetchLifeRule = async () => {
      const response = await getLifeRule()
      if (response.success) {
        console.log('너무꾸덕해 response.data🔥', response.data)
        setLifeRuleList(response.data.lifeRules)
        await dispatch(setLifeRules(response.data.lifeRules))
      } else {
        setIsEmpty(true)
      }
    }
    fetchLifeRule()
  }, [])

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
        {isEmpty && (
          <EmptyContainer>
            <Image
              src={'/images/lifeRule/update.svg'}
              alt={'생활규칙 수정아이콘'}
              width={80}
              height={80}
              style={{ objectFit: 'cover' }}
            />

            <TitleContainer>만들어진 생활규칙이 없습니다</TitleContainer>
            <Description>
              친구들과 대화를 통해 생활규칙을 만들어보세요!
            </Description>
            <ConfirmButton
              label={'생활 규칙 생성하러 가기'}
              onClick={handleCreate}
            />
          </EmptyContainer>
        )}

        {isUpdated && <NoticeBar message={t('lifeRule.updateMessage')} />}
        {lifeRuleList?.length > 0 && (
          <LifeRuleList lifeRuleList={lifeRuleList} />
        )}
      </FullMain>

      <UpdateModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        onConfirm={handleCloseModal}
      />

      <BottomNavigation />
    </Container>
  )
}
