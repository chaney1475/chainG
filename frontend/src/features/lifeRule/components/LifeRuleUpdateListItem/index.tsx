'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Image from 'next/image'

import { lifeRuleCategoryList } from '@/constants/lifeRuleList'
import { LifeRule, LifeRuleUpdateVariant } from '@/types/lifeRule'

import { InputBox } from '../InputBox'
import {
  ActionButtons,
  CatrgoryIcon,
  Container,
  Content,
  ItemContainer,
} from './styles'

interface LifeRuleUpdateListItemProps {
  lifeRule: LifeRule
  variant: LifeRuleUpdateVariant
  setVariant: (variant: LifeRuleUpdateVariant) => void
}

const ActionButton = ({
  type,
  onClick,
}: {
  type: 'update' | 'delete'
  onClick: () => void
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        padding: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
      }}>
      <Image
        src={`/images/lifeRule/${type}.svg`}
        alt={type}
        width={24}
        height={24}
      />
    </button>
  )
}

export const LifeRuleUpdateListItem = ({
  lifeRule,
  variant,
  setVariant,
}: LifeRuleUpdateListItemProps) => {
  const { t } = useTranslation()
  const [content, setContent] = useState(lifeRule.content)

  const renderContent = () => {
    switch (variant) {
      case 'DELETE':
        return (
          <>
            <p>{content}</p>
            <button onClick={() => setVariant('DEFAULT')}>취소</button>
          </>
        )
      case 'UPDATE':
        return (
          <>
            <InputBox
              id={lifeRule.id.toString()}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={() => setVariant('DEFAULT')}>확인</button>
          </>
        )
      case 'CREATE':
        return (
          <>
            <InputBox
              id={lifeRule.id.toString()}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={() => setVariant('DEFAULT')}>생성</button>
          </>
        )
      default:
        return (
          <>
            <p>{content}</p>
            <ActionButtons>
              <ActionButton
                type="update"
                onClick={() => setVariant('UPDATE')}
              />
              <ActionButton
                type="delete"
                onClick={() => setVariant('DELETE')}
              />
            </ActionButtons>
          </>
        )
    }
  }

  return (
    <ItemContainer variant={variant}>
      <CatrgoryIcon>
        <Image
          src={
            lifeRuleCategoryList.find(
              (category) => category.id === lifeRule.category,
            )?.src ?? '/images/lifeRule/life-rule-category-clean.svg'
          }
          alt={lifeRule.category}
          width={46}
          height={46}
        />
      </CatrgoryIcon>
      <Content>{renderContent()}</Content>
    </ItemContainer>
  )
}
