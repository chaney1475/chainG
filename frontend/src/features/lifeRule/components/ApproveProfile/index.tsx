'use client'

import React from 'react'

import Image from 'next/image'

import { UserItem } from '@/components/UserItem'
import { useAppSelector } from '@/hooks/useAppSelector'
import { UserTileContainer } from '@/styles/styles'

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
    imageUrl: '/images/profile/user1.png',
    isApproved: false,
  },
  {
    id: '2',
    name: '미리미',
    imageUrl: '/images/profile/user2.png',
    isApproved: false,
  },
  {
    id: '3',
    name: '비동현',
    imageUrl: '/images/profile/user3.png',
    isApproved: true,
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
  const group = useAppSelector((state) => state.group.group)
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
            width={42}
            height={42}
          />
          <span>{profile.name}</span>
        </ProfileItem>
      ))}

      <UserTileContainer>
        {group?.members &&
          group.members.map((user) => (
            <UserItem
              key={user.id}
              user={user}
              variant="tile"
              size="small"
            />
          ))}
      </UserTileContainer>
    </ProfileList>
  )
}
