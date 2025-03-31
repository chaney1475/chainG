'use client'

import React from 'react'

import Image from 'next/image'

import { ProfileItem, ProfileList } from './styles'

interface Profile {
  id: string
  name: string
  imageUrl: string
  isApproved?: boolean
}

const profiles: Profile[] = [
  {
    id: '1',
    name: '현래래',
    imageUrl: '/images/lifeRule/profile.svg',
  },
  {
    id: '2',
    name: '미리미',
    imageUrl: '/images/lifeRule/profile.svg',
  },
  {
    id: '3',
    name: '비동현',
    imageUrl: '/images/lifeRule/profile.svg',
  },
]

interface ApproveProfileProps {
  selectedId: string
  onSelect: (id: string) => void
}

export function ApproveProfile({
  selectedId,
  onSelect,
}: ApproveProfileProps): React.ReactElement {
  return (
    <ProfileList>
      {profiles.map((profile) => (
        <ProfileItem
          key={profile.id}
          isSelected={selectedId === profile.id}
          onClick={() => onSelect(profile.id)}>
          <Image
            src={
              profile.isApproved
                ? '/images/lifeRule/approve.svg'
                : profile.imageUrl
            }
            alt={profile.name}
            width={46}
            height={46}
          />
          <span>{profile.name}</span>
        </ProfileItem>
      ))}
    </ProfileList>
  )
}
