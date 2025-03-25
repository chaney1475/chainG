'use client'

import React from 'react'

import { useTheme } from '@emotion/react'

import { profileList } from '@/constants/profileList'

import {
  Container,
  ProfileGrid,
  ProfileImage,
  SelectedImage,
} from './ProfileSelector.styles'

interface ProfileSelectorProps {
  selectedId: string
  onSelect: (id: string) => void
}

function ProfileSelector({
  selectedId,
  onSelect,
}: ProfileSelectorProps): React.ReactElement {
  const theme = useTheme()
  const selected = profileList.find((profile) => profile.id === selectedId)

  return (
    <Container>
      {selected && (
        <SelectedImage
          src={selected.src}
          alt={`Selected profile ${selected.id}`}
          width={100}
          height={100}
        />
      )}
      <ProfileGrid>
        {profileList.map((profile) => (
          <ProfileImage
            key={profile.id}
            src={profile.src}
            alt={`Profile option ${profile.id}`}
            width={50}
            height={50}
            isSelected={selectedId === profile.id}
            primaryColor={theme.color.primary}
            onClick={() => onSelect(profile.id)}
          />
        ))}
      </ProfileGrid>
    </Container>
  )
}

export default ProfileSelector
