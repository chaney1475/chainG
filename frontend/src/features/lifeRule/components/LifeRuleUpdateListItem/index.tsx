'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import Image from 'next/image'

import { IconButton } from '@/components'
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
  actionType: LifeRuleUpdateVariant
  setVariant: (variant: LifeRuleUpdateVariant) => void
  onContentChange: (content: string) => void
  onAddItem: (index: number) => void
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
  actionType,
  setVariant,
  onContentChange,
  onAddItem,
  index,
}: LifeRuleUpdateListItemProps) => {
  const { t } = useTranslation()
  const { register, watch } = useFormContext()
  const content = watch(`items.${index}.content`)

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
              {...register(`items.${index}.content`, {
                onChange: (e) => onContentChange(e.target.value),
              })}
              id={lifeRule.id.toString()}
              value={content}
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
              {...register(`items.${index}.content`, {
                onChange: (e) => onContentChange(e.target.value),
              })}
              id={lifeRule.id.toString()}
              value={content}
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

  return (
    <ItemContainer variant={variant}>
      v{variant} a{actionType}
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
