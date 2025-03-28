'use client'

import { useTranslation } from 'react-i18next'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { dutyCategoryList } from '@/constants/dutyList'
import { Duty } from '@/types/duty'

import { Container, Name, ProfileContainer } from './styles'

interface AssigneesProps {
  assignees: number[]
}

export const Assignees = ({ assignees }: AssigneesProps) => {
  const profileList = [
    {
      src: '/images/profile/user1.png',
      name: '펭펭이이오',
    },
    {
      src: '/images/profile/user1.png',
      name: '펭펭이이오',
    },
  ]
  return (
    <Container>
      {profileList.map((profile) => (
        <ProfileContainer>
          <Image
            src={profile.src}
            alt={profile.name}
            width={32}
            height={32}
          />
          <Name>{profile.name}</Name>
        </ProfileContainer>
      ))}
    </Container>
  )
}
