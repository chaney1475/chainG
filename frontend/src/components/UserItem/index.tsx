'use client'

import Image from 'next/image'

import { User } from '@/types/user'

import { ProfileContainer } from './styles'

interface UserItemProps {
  user: User
  variant?: 'bar' | 'tile'
  showName?: boolean
  size?: 'small' | 'medium' | 'large'
}

export const UserItem = ({
  user,
  variant = 'tile',
  showName = false,
  size = 'medium',
}: UserItemProps) => {
  return (
    <ProfileContainer
      variant={variant}
      size={size}>
      <Image
        src={
          `/images/profile/${user.profileImage}.png` ||
          '/images/profile/user1.png'
        }
        alt={user.name}
        width={size === 'small' ? 36 : size === 'medium' ? 40 : 50}
        height={size === 'small' ? 36 : size === 'medium' ? 40 : 50}
      />
      {showName ? user.name : user.nickname}
    </ProfileContainer>
  )
}
