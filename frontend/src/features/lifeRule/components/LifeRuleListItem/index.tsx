'use client'

// import { useState } from 'react'
// import { useTranslation } from 'react-i18next'
import Image from 'next/image'

import { lifeRuleCategoryList } from '@/constants/lifeRuleList'
import { LifeRule } from '@/types/lifeRule'

import { CatrgoryIcon, Container, Content } from './styles'

interface LifeRuleListItemProps {
  lifeRule: LifeRule
}

export const LifeRuleListItem = ({ lifeRule }: LifeRuleListItemProps) => {
  //const { t } = useTranslation()
  return (
    <Container>
      <CatrgoryIcon>
        <Image
          src={
            lifeRuleCategoryList.find(
              (category) => category.id === lifeRule.category,
            )?.src ?? '/images/lifeRule/life-rule-category-clean.svg  '
          }
          alt={lifeRule.category}
          width={46}
          height={46}
        />
      </CatrgoryIcon>
      <Content>{lifeRule.content}</Content>
    </Container>
  )
}
