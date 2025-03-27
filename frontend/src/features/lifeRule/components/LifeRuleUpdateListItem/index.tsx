'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Image from 'next/image'

import { lifeRuleCategoryList } from '@/constants/lifeRuleList'
import { LifeRule, LifeRuleUpdateVariant } from '@/types/lifeRule'

import { InputBox } from '../InputBox'
import { CatrgoryIcon, Container, Content, ItemContainer } from './styles'

interface LifeRuleUpdateListItemProps {
  lifeRule: LifeRule
  variant: LifeRuleUpdateVariant
  setVariant: (variant: LifeRuleUpdateVariant) => void
}

const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div>
      <button onClick={onClick}>취소</button>
    </div>
  )
}

const UpdateButton = ({
  showButton,
  onClick,
}: {
  showButton: boolean
  onClick: () => void
}) => {
  return showButton ? (
    <div onClick={onClick}> 확인</div>
  ) : (
    <div onClick={onClick}>(수정)(삭제) </div>
  )
}

export const LifeRuleUpdateListItem = ({
  lifeRule,
  variant,
  setVariant,
}: LifeRuleUpdateListItemProps) => {
  const [showButton, setShowButton] = useState(false)

  const { t } = useTranslation()
  return (
    <ItemContainer variant={variant}>
      <CatrgoryIcon>
        {variant}
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

      {variant === 'DELETE' ? (
        <Content>
          <Content onClick={() => setShowButton(!showButton)}>
            {lifeRule.content}
          </Content>
          <DeleteButton onClick={() => setVariant('DEFAULT')} />
        </Content>
      ) : (
        <Content>
          <InputBox id={lifeRule.id.toString()} />
          <UpdateButton
            showButton={showButton}
            onClick={() => setShowButton(!showButton)}
          />
        </Content>
      )}
    </ItemContainer>
  )
}
