'use client'

import { useState } from 'react'

import Image from 'next/image'

import { ContractStatus } from '@/types/contract'
import { User } from '@/types/user'

import { StatusLabel } from '../StatusLabel'
import { ProfileContainer} from './styles'

interface UserItemProps {
  user: User
  variant?: 'bar' | 'tile'
  showName?: boolean
  size?: 'small' | 'medium' | 'large'
  contractStatus?: ContractStatus
}

export const UserItem = ({
  user,
  variant = 'tile',
  showName = false,
  size = 'medium',
  contractStatus,
}: UserItemProps) => {
  const [imgSrc, setImgSrc] = useState(
    `/images/profile/${user.profileImage}.png`,
  )

  const handleImageError = () => {
    const imgSrc = `/images/profile/user${user.id % 10}.png`
    setImgSrc(imgSrc)
  }

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
      <span>{showName ? user.name : user.nickname}</span>

      {contractStatus && <StatusLabel contractStatus={contractStatus} />}
    </ProfileContainer>
  )
}
