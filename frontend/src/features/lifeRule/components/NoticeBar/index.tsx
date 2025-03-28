'use client'

import React from 'react'

import Image from 'next/image'

import { NoticeBarContainer } from './styles'

interface NoticeBarProps {
  message: string
}

export const NoticeBar: React.FC<NoticeBarProps> = ({ message }) => {
  return (
    <NoticeBarContainer>
      <Image
        src="/images/lifeRule/notice.svg"
        alt="notice"
        width={20}
        height={20}
      />

      {message}
      <Image
        src="/images/lifeRule/move-right.svg"
        alt="notice"
        width={20}
        height={20}
      />
    </NoticeBarContainer>
  )
}
