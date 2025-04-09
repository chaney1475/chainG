'use client'

// import { useState } from 'react'
// import { useTranslation } from 'react-i18next'
import { Image } from '@/components'
import { LifeRule } from '@/types/lifeRule'

import { CatrgoryIcon, Container, Content } from './styles'

interface LifeRuleListItemProps {
  lifeRule: LifeRule
}

export function LifeRuleListItem({ lifeRule }: LifeRuleListItemProps) {
  //const { t } = useTranslation()
  return (
    <Container>
      <CatrgoryIcon>
        <Image
          src={`/images/lifeRule/life-rule-category-${lifeRule.category.toLowerCase().trim()}.svg`}
          alt={lifeRule.category}
          width={46}
          height={46}
        />
      </CatrgoryIcon>
      <Content>{lifeRule.content}</Content>
    </Container>
  )
}
