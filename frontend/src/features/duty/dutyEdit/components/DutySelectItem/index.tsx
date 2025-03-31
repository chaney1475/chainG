'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

import Image from 'next/image'

import { User } from '@/constants/userList'
import '@/styles/styles'

import { Container } from './styles'

interface DutySelectItemProps {
  user: User
  selected?: boolean
  onClick?: () => void
}

export function DutySelectItem({
  user,
  selected = false,
  onClick,
}: DutySelectItemProps) {
  const { t } = useTranslation()

  return (
    <Container
      onClick={onClick}
      selected={selected}>
      <Image
        src={user.profileImage ?? '/images/duty/duty-category-clean.png'}
        alt={user.name}
        width={32}
        height={32}
      />
      <div>{user.nickname}</div>
    </Container>
  )
}
