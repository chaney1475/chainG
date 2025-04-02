'use client'

import Image from 'next/image'

import { UserItem } from '@/components/UserItem'
import { userList } from '@/constants/userList'
import { User } from '@/types/user'

import { Container, Name, ProfileContainer } from './styles'

interface AssigneesProps {
  assignees: number[]
  userList: User[]
}

export const Assignees = ({ assignees }: AssigneesProps) => {
  const assigneeIdSet = new Set(assignees)
  const assigneesList = userList.filter((item) => assigneeIdSet.has(item.id))

  console.log(assigneeIdSet)
  return (
    <Container>
      {assigneesList.map((item) => (
        <UserItem
          key={item.id}
          user={item}
        />
      ))}
    </Container>
  )
}
