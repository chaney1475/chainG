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
import { ConfirmContainer, FullMain, LifeRuleUpdateList } from './styles'

export function LifeRuleUpdatePage() {
  const { t } = useTranslation()
  const router = useRouter()

  const [items, setItems] = useState<
    Array<{ id: number; rule: LifeRule; variant: LifeRuleUpdateVariant }>
  >(
    lifeRuleList.map((rule, index) => ({
      id: index,
      rule,
      variant: 'DEFAULT',
    })),
  )

  const [isUpdated, setIsUpdated] = useState(false)
  const [isUpdateMode, setIsUpdateMode] = useState(false)

  const handleVariantChange = (
    id: number,
    newVariant: LifeRuleUpdateVariant,
  ) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, variant: newVariant } : item,
      ),
    )
    setIsUpdateMode(true)
    setIsUpdated(true)
  }

  const handleCreateNew = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        id: prevItems.length,
        rule: lifeRuleList[0],
        variant: 'CREATE',
      },
    ])
    setIsUpdateMode(true)
    setIsUpdated(true)
  }

  const handleContentChange = () => {
    setIsUpdated(true)
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
              onContentChange={handleContentChange}
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

      <ConfirmContainer>
        <ConfirmButton
          label="완료"
          variant={isUpdated && isUpdateMode ? 'next' : 'disabled'}
        />
      </ConfirmContainer>
    </Container>
  )
}
