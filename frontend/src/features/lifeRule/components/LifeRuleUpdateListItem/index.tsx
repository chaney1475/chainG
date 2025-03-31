'use client'

import React, { useState } from 'react'
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
  CreateButton,
  DeleteButton,
  ItemContainer,
  StyledActionButton,
  UpdateButton,
} from './styles'

interface LifeRuleUpdateListItemProps {
  lifeRule: LifeRule
  variant: LifeRuleUpdateVariant
  setVariant: (variant: LifeRuleUpdateVariant) => void
  onContentChange: () => void
  onDelete: () => void
}

const ActionButton = ({
  type,
  onClick,
}: {
  type: 'update' | 'delete'
  onClick: () => void
}) => {
  return (
    <StyledActionButton onClick={onClick}>
      <Image
        src={`/images/lifeRule/${type}.svg`}
        alt={type}
        width={24}
        height={24}
      />
    </StyledActionButton>
  )
}

export const LifeRuleUpdateListItem = ({
  lifeRule,
  variant,
  setVariant,
  onContentChange,
  onDelete,
}: LifeRuleUpdateListItemProps) => {
  const { t } = useTranslation()
  const [content, setContent] = useState(lifeRule.content)

  const renderContent = () => {
    switch (variant) {
      case 'DELETE':
        return (
          <>
            <p>{content}</p>
            <DeleteButton onClick={() => setVariant('DEFAULT')}>
              취소
            </DeleteButton>
            <StyledActionButton onClick={onDelete}>삭제</StyledActionButton>{' '}
            {/* 삭제 버튼 */}
          </>
        )
      case 'UPDATE':
        return (
          <>
            <InputBox
              id={lifeRule.id.toString()}
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                onContentChange()
              }}
            />
            <UpdateButton onClick={() => setVariant('DEFAULT')}>
              확인
            </UpdateButton>
          </>
        )
      case 'CREATE':
        return (
          <>
            <InputBox
              id={lifeRule.id.toString()}
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                onContentChange()
              }}
            />
            <CreateButton onClick={() => setVariant('DEFAULT')}>
              추가
            </CreateButton>
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
