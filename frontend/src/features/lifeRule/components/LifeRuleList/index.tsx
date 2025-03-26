'use client'

import React from 'react'

import { LifeRule } from '@/types/lifeRule'

import { LifeRuleListItem } from '../LifeRuleListItem'
import { Container } from './styles'

interface LifeRuleListProps {
  lifeRuleList: LifeRule[]
}

export function LifeRuleList({ lifeRuleList }: LifeRuleListProps) {
  return (
    <Container>
      {lifeRuleList.map((lifeRule) => (
        <LifeRuleListItem
          key={lifeRule.id}
          lifeRule={lifeRule}
        />
      ))}
    </Container>
  )
}
