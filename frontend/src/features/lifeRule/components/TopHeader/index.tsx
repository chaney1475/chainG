'use client'

import { memo } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Container, HeaderButton } from './styles'

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
        onClick={handleUpdateClick}
        src="/icons/update.svg"
        alt="수정"
        width={24}
        height={24}
        style={{ cursor: isUpdated ? 'not-allowed' : 'pointer' }}
      />
    </Container>
  )
})
