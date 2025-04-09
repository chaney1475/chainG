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
import { useAppSelector } from '@/hooks'
import { setLifeRules } from '@/store/slices/lifeRuleSlice'
import { setHomeOverviewLifeRuleApproved } from '@/store/slices/userSlice'
import { RootState } from '@/store/store'
import { Container, Title } from '@/styles/styles'

import { LifeRuleList } from './components/LifeRuleList'
import { NoticeBar } from './components/NoticeBar'
import { Description, EmptyContainer, FullMain, TitleContainer } from './styles'

export function LifeRulePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()
  const lifeRuleList = useAppSelector(
    (state: RootState) => state.lifeRule.lifeRules,
  )

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isEmpty, setIsEmpty] = useState<boolean>(false)

  const handleCreate = async () => {
    const response = await createLifeRule({ rules: [] })
    console.log('response🔥', response)
    if (response.success) {
      router.push('/lifeRule/update')
      dispatch(setHomeOverviewLifeRuleApproved(true))
    }
  }
  const homeOverview = useAppSelector(
    (state: RootState) => state.user.homeOverview,
  )

  useEffect(() => {
    console.log('lifeRuleList🔥', lifeRuleList)
    const fetchData = async () => {
      try {
        // 생활규칙 목록 가져오기
        const lifeRuleResponse = await getLifeRule()
        if (lifeRuleResponse.success) {
          console.log('lifeRuleResponse', lifeRuleResponse.data)
          await dispatch(setLifeRules(lifeRuleResponse.data.lifeRules))
        } else {
          setIsEmpty(true)
        }

        // 업데이트된 내용 확인
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
        isUpdated={homeOverview?.isLifeRuleApproved}
        handleOpenModal={() => setIsModalOpen(true)}
      />
      <FullMain>
        {homeOverview?.isLifeRuleApproved && (
          <NoticeBar message={t('lifeRule.updateMessage')} />
        )}
        {isEmpty && (
          <EmptyContainer>
            <Image
              src={'/icons/button-modify.svg'}
              alt={'생활규칙 수정아이콘'}
              width={80}
              height={80}
              style={{ objectFit: 'cover' }}
            />

            <TitleContainer>
              <Title>만들어진 생활규칙이 없습니다</Title>
            </TitleContainer>
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
