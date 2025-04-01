'use client'

import React from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { DivContainer, NoticeBarContainer } from './styles'

interface NoticeBarProps {
  message: string
}

export const NoticeBar: React.FC<NoticeBarProps> = ({ message }) => {
  const router = useRouter()
  const handleClick = () => {
    router.push('/lifeRule/updateApprove')
  }
  return (
    <NoticeBarContainer onClick={handleClick}>
      <DivContainer>
        <Image
          src="/images/lifeRule/notice.svg"
          alt="notice"
          width={20}
          height={20}
        />

        {message}
      </DivContainer>
      <Image
        src="/images/lifeRule/move-right.svg"
        alt="notice"
        width={20}
        height={20}
      />
    </NoticeBarContainer>
  )
}
