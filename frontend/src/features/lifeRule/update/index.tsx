'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { ConfirmButton } from '@/components/ConfirmButton'
import { TopHeader } from '@/components/TopHeader'
import { lifeRuleList } from '@/constants/lifeRuleList'
import { Container } from '@/styles/styles'
import { LifeRule, LifeRuleUpdateVariant } from '@/types/lifeRule'

import { LifeRuleUpdateListItem } from '../components/LifeRuleUpdateListItem'
import { FullMain, LifeRuleUpdateList } from './styles'

export function LifeRuleUpdatePage() {
  const { t } = useTranslation()
  const router = useRouter()

  // 상태 설정
  const [items, setItems] = useState<
    Array<{ id: number; rule: LifeRule; variant: LifeRuleUpdateVariant }>
  >(
    lifeRuleList.map((rule, index) => ({
      id: index,
      rule,
      variant: 'DEFAULT',
    })),
  )

  // 상태 관리
  const [isUpdated, setIsUpdated] = useState(false) // 수정된 상태
  const [isUpdateMode, setIsUpdateMode] = useState(false) // 수정 모드 여부

  // 상태 변경
  const handleVariantChange = (
    id: number,
    newVariant: LifeRuleUpdateVariant,
  ) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, variant: newVariant } : item,
      ),
    )
    setIsUpdateMode(true) // 수정 모드로 설정
    setIsUpdated(true) // 수정된 상태로 설정
  }

  // 새 항목 추가
  const handleCreateNew = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        id: prevItems.length,
        rule: lifeRuleList[0],
        variant: 'CREATE',
      },
    ])
    setIsUpdateMode(true) // 새 항목 추가 시 수정 모드로 설정
    setIsUpdated(true) // 새 항목이 생성되었으므로 수정된 상태로 설정
  }

  // 생성된 항목 삭제
  const handleDeleteItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id)) // 삭제된 항목 제거
    setIsUpdated(false) // 항목이 삭제되었으므로 수정된 상태가 아님
    setIsUpdateMode(false) // 삭제 후 수정 모드 종료
  }

  // 내용 수정 체크
  const handleContentChange = () => {
    setIsUpdated(true) // 내용이 수정되었음을 표시
  }

  return (
    <Container>
      <TopHeader title={t('lifeRule.title')} />
      <FullMain>
        <LifeRuleUpdateList>
          {items.map((item) => (
            <LifeRuleUpdateListItem
              key={item.id}
              lifeRule={item.rule}
              variant={item.variant}
              setVariant={(variant) => handleVariantChange(item.id, variant)}
              onContentChange={handleContentChange} // 컨텐츠가 변경되면 호출
              onDelete={() => handleDeleteItem(item.id)} // 삭제 시 항목 삭제
            />
          ))}
        </LifeRuleUpdateList>

        <Image
          onClick={handleCreateNew}
          src="/images/lifeRule/create.svg"
          alt="create"
          width={46}
          height={46}
        />
      </FullMain>

      {/* 'next' 상태는 수정되었을 때, 'disabled' 상태는 수정되지 않았을 때 */}
      <ConfirmButton
        label="완료"
        variant={isUpdated && isUpdateMode ? 'next' : 'disabled'} // 수정된 상태일 때만 'next'로 활성화
      />
    </Container>
  )
}
