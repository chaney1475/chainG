'use client'

import React from 'react'

import Image from 'next/image'

import { lifeRuleCategoryList } from '@/constants/lifeRuleList'
import { LifeRuleUpdateVariant, UpdateLifeRule } from '@/types/lifeRule'

import {
  CatrgoryIcon,
  Content,
  ContentContainer,
  ItemContainer,
  StatusIcon,
} from './styles'

interface LifeRuleUpdateApproveListItemProps {
  lifeRule: UpdateLifeRule
  variant: LifeRuleUpdateVariant | string
}

export const LifeRuleUpdateApproveListItem = ({
  lifeRule,
  variant,
}: LifeRuleUpdateApproveListItemProps) => {
  // const { t } = useTranslation()

  const getStatusIcon = () => {
    switch (variant) {
      case 'UPDATE':
        return '/icons/button-modify.svg'
      case 'CREATE':
        return '/icons/button-create.svg'
      case 'DELETE':
        return '/icons/button-delete.svg'
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (variant) {
      case 'UPDATE':
        return '수정'
      case 'CREATE':
        return '추가'
      case 'DELETE':
        return '삭제'
      default:
        return ''
    }
  }

  return (
    <ItemContainer variant={variant as LifeRuleUpdateVariant}>
      <CatrgoryIcon>
        <Image
          src={
            lifeRuleCategoryList.find(
              (category) => category.id === lifeRule.category,
            )?.src ?? '/images/lifeRule/life-rule-CLEANING-active.svg'
          }
          alt={lifeRule.category}
          width={46}
          height={46}
        />
      </CatrgoryIcon>
      {lifeRule.category}
      <Content>
        <ContentContainer>{lifeRule.content}</ContentContainer>
        {getStatusIcon() && (
          <StatusIcon>
            <Image
              src={getStatusIcon() as string}
              alt="status"
              width={24}
              height={24}
            />
            <p>{getStatusText()}</p>
          </StatusIcon>
        )}
      </Content>
    </ItemContainer>
  )
}
