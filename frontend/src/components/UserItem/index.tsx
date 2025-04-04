'use client'

import { useState } from 'react'

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
  const [imgSrc, setImgSrc] = useState(
    `/images/profile/${user.profileImage}.png`,
  )

  const handleImageError = () => {
    const imgSrc = `/images/profile/user${user.id % 10}.png`
    setImgSrc(imgSrc)
  }

  console.log(showName)

  return (
    <ProfileContainer
      variant={variant}
      size={size}>
      <Image
        src={imgSrc}
        alt={user.name}
        width={size === 'small' ? 36 : size === 'medium' ? 40 : 50}
        height={size === 'small' ? 36 : size === 'medium' ? 40 : 50}
        onError={handleImageError}
      />
      {showName ? user.name : user.nickname}
    </ProfileContainer>
  )
}
