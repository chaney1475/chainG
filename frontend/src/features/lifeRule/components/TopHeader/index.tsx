'use client'

import { memo } from 'react'

import { useRouter } from 'next/navigation'

import { Image } from '@/components'

import { Container, HeaderButton, Title } from './styles'

interface TopHeaderProps {
  title: string
  isUpdated: boolean
  handleOpenModal: () => void
}

export const TopHeader = memo(function TopHeader({
  title,
  isUpdated,
  handleOpenModal,
}: TopHeaderProps) {
  const router = useRouter()

  const handleUpdateClick = () => {
    if (isUpdated) {
      handleOpenModal()
    } else {
      router.push('/lifeRule/update')
    }
  }

  const click = () => {
    console.log('isclick')
  }

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
      <Title>{title}</Title>
      <div
        onClick={handleUpdateClick}
        style={{ cursor: isUpdated ? 'not-allowed' : 'pointer' }}>
        <Image
          src="/icons/modify.svg"
          alt="수정"
          width={30}
          height={30}
        />
      </div>
    </Container>
  )
})
