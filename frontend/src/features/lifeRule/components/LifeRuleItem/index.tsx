'use client'

import { memo } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Container, HeaderButton } from './styles'

interface TopHeaderProps {
  title: string
}

export const LifeRuleItem = memo(function TopHeader({ title }: TopHeaderProps) {
  const router = useRouter()
  return (
    <Container>
      <HeaderButton onClick={() => router.back()}>
        <Image
          src="/icons/arrow-left.svg"
          alt="뒤로 가기"
          width={24}
          height={24}
        />
      </HeaderButton>
      <div>{title}</div>
      <Image
        src="/icons/edit.svg"
        alt="수정"
        width={24}
        height={24}
      />
    </Container>
  )
})
