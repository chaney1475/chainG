'use client'

import { UserItem } from '@/components/UserItem'
import { User } from '@/types/user'

import { Container } from './styles'

interface AssigneesProps {
  assignees: number[]
  userList: User[]
}

export const Assignees = ({ assignees, userList }: AssigneesProps) => {
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
