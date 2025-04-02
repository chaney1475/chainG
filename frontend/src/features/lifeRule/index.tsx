'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { createLifeRule, getLifeRule, getUpdateLifeRule } from '@/apis/lifeRule'
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

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [hasUpdates, setHasUpdates] = useState<boolean>(false)
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
    const fetchData = async () => {
      try {
        // 생활규칙 목록 가져오기
        const lifeRuleResponse = await getLifeRule()
        if (lifeRuleResponse.success) {
          console.log('너무꾸덕해 response.data🔥', lifeRuleResponse.data)
          setLifeRuleList(lifeRuleResponse.data.lifeRules)
          await dispatch(setLifeRules(lifeRuleResponse.data.lifeRules))
        } else {
          setIsEmpty(true)
        }

        // 업데이트된 내용 확인
        const updateResponse = await getUpdateLifeRule()
        if (updateResponse.success) {
          setHasUpdates(updateResponse.data.length > 0)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <Container>
      <TopHeader
        title={t('lifeRule.title')}
        isUpdated={hasUpdates}
        handleOpenModal={() => setIsModalOpen(true)}
      />
      <FullMain>
        {hasUpdates && <NoticeBar message={t('lifeRule.updateMessage')} />}
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

        {lifeRuleList?.length > 0 && (
          <LifeRuleList lifeRuleList={lifeRuleList} />
        )}
      </FullMain>

      <UpdateModal
        open={isModalOpen}
        onOpenChange={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
      />

      <BottomNavigation />
    </Container>
  )
}
