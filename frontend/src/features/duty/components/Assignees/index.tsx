'use client'

import Image from 'next/image'

import { userList } from '@/constants/userList'

import { Container, Name, ProfileContainer } from './styles'

interface AssigneesProps {
  assignees: number[]
}

export const Assignees = ({ assignees }: AssigneesProps) => {
  const assigneeIdSet = new Set(assignees)
  const assigneesList = userList.filter((item) => assigneeIdSet.has(item.id))

  console.log(assigneeIdSet)
  return (
    <Container>
      {assigneesList.map((item) => (
        <ProfileContainer key={item.id}>
          <Image
            src={item.profileImage ?? ''}
            alt={item.name}
            width={32}
            height={32}
          />
          <Name>{item.nickname}</Name>
        </ProfileContainer>
      ))}
    </Container>
  )
}
