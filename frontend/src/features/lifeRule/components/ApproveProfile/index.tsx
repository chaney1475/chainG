'use client'

import React from 'react'

import { UserItem } from '@/components/UserItem'
import { useAppSelector } from '@/hooks/useAppSelector'
import { UserTileContainer } from '@/styles/styles'

import { ProfileList } from './styles'

export function ApproveProfile(): React.ReactElement {
  const group = useAppSelector((state) => state.group.group)

  return (
    <ProfileList>
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
