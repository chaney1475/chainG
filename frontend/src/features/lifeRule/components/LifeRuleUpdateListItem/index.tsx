'use client'

import React from 'react'

import { IconButton } from '@/components'
//import { useTranslation } from 'react-i18next'

import { Image } from '@/components'
import { lifeRuleCategoryList } from '@/constants/lifeRuleList'
import { LifeRule, LifeRuleUpdateVariant } from '@/types/lifeRule'

import { InputBox } from '../InputBox'
import {
  ActionButtons,
  CatrgoryIcon,
  Content,
  CreateButton,
  DeleteButton,
  ItemContainer,
  UpdateButton,
} from './styles'

interface LifeRuleUpdateListItemProps {
  lifeRule: LifeRule
  variant: LifeRuleUpdateVariant
  actionType: LifeRuleUpdateVariant
  content: string
  setVariant: (variant: LifeRuleUpdateVariant) => void
  onContentChange: (content: string) => void
  onAddItem: (index: number) => void
  onUpdateConfirm: () => void
  index: number
}

const ActionButton = ({
  type,
  onClick,
}: {
  type: 'update' | 'delete'
  onClick: () => void
}) => {
  return (
    <IconButton
      onClick={onClick}
      src={`/images/lifeRule/${type}.svg`}
      alt={type}
    />
  )
}

//ActionButton.displayName = 'ActionButton'

export const LifeRuleUpdateListItem = ({
  lifeRule,
  variant,
  content,
  setVariant,
  onContentChange,
  onAddItem,
  onUpdateConfirm,
  index,
}: Omit<LifeRuleUpdateListItemProps, 'actionType'>) => {
  //const { t } = useTranslation()

  const renderContent = () => {
    switch (variant) {
      case 'DELETE':
        return (
          <>
            <p>{content}</p>
            <DeleteButton onClick={() => setVariant('DEFAULT')}>
              취소
            </DeleteButton>
          </>
        )
      case 'UPDATE':
        return (
          <>
            <InputBox
              id={`update-${lifeRule.id}`}
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="수정할 내용을 입력하세요"
            />
            <UpdateButton onClick={onUpdateConfirm}>확인</UpdateButton>
          </>
        )
      case 'CREATE':
        return (
          <>
            <InputBox
              id={`create-${lifeRule.id}`}
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="새로운 내용을 입력하세요"
            />
            <CreateButton onClick={() => onAddItem(index)}>추가</CreateButton>
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

  console.log('LifeRule')

  return (
    <ItemContainer variant={variant}>
      <CatrgoryIcon>
        <Image
          src={`/images/lifeRule/life-rule-${lifeRule.category.trim()}-inactive.svg`}
          alt={lifeRule.category}
          width={46}
          height={46}
        />
      </CatrgoryIcon>
      <Content>{renderContent()}</Content>
    </ItemContainer>
  )
}
