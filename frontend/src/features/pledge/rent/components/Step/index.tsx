'use client'

import { useEffect } from 'react'

import { UserItem } from '@/components/UserItem'
import { useAppSelector } from '@/hooks/useAppSelector'
import { BudgetStatus } from '@/types/budget'
import { User } from '@/types/user'

import { BoxContainer } from '../../../styles'
import {
  BarContainer,
  ContentContainer,
  StatusIcon,
  StepContainer,
  StepItem,
  TopDescription,
} from './styles'

interface UserList {
  user: User
  month: monthPaid[]
}

interface monthPaid {
  month: number
  finalStatus: BudgetStatus
}

export function Step() {
  const rentInfo = useAppSelector((state) => state.pledge.rent)
  const userId = useAppSelector((state) => state.user.user.id)
  const user = rentInfo?.currentMonth.find((item) => item.userId === userId)
  const group = useAppSelector((state) => state.group.group.members)

  useEffect(() => {
    const date = new Date().getDate()
    const dutDate = rentInfo?.dueDate || 0
    const exceedDueDate: boolean = dutDate < date

    rentInfo?.monthList.slice(0, 6).forEach((item) => {
      item.piadUserIds?.forEach((paidUser) => {
        userList
          .find((user) => user.user.id === paidUser)
          ?.month.push({
            month: Number(item.month.slice(5)),
            finalStatus: 'complete',
          })
      })
      item.debtUserIds.forEach((debtUser) => {
        userList
          .find((user) => user.user.id === debtUser)
          ?.month.push({
            month: Number(item.month.slice(5)),
            finalStatus: exceedDueDate ? 'debt' : 'expected',
          })
      })
    }) // todo: 6개까지만 가져오도록 한정하기
  }, [])

  const userList: UserList[] = group.map((item) => {
    return {
      user: item,
      month: [],
    }
  })

  console.log('group', group)
  console.log('rentInfo', rentInfo)
  console.log('userList', userList)

  return (
    <>
      <BoxContainer>
        <ContentContainer>
          <TopDescription>전체 납부 현황 </TopDescription>

          <StepContainer>
            {userList.map((item) => (
              <StepItem key={item.user.id}>
                <UserItem
                  user={item.user}
                  variant="bar"
                  size="small"
                />
                <BarContainer>
                  {item.month.map((month) => (
                    <StatusIcon
                      variant={month.finalStatus}
                      key={month.month}
                    />
                  ))}
                </BarContainer>
              </StepItem>
            ))}
          </StepContainer>
        </ContentContainer>
      </BoxContainer>
    </>
  )
}
