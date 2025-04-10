'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { UserItem } from '@/components/UserItem'
import { useAppSelector } from '@/hooks/useAppSelector'
import { BudgetStatus } from '@/types/budget'
import { User } from '@/types/user'

import { BoxContainer } from '../../../styles'
import {
  BarContainer,
  BlankContainer,
  BottomContainer,
  ContentContainer,
  MonthContainer,
  MonthLabel,
  MonthLabelsContainer,
  MonthText,
  StatusBarContainer,
  StatusContainer,
  StatusIcon,
  StepContainer,
  StepItem,
  TopDescription,
} from './styles'

interface UserList {
  user: User
  week: weekPaid[]
}

interface weekPaid {
  month: number
  week: number
  finalStatus: BudgetStatus
}

export function Step() {
  const { t } = useTranslation()
  const utilityInfo = useAppSelector((state) => state.pledge.utility)
  const userId = useAppSelector((state) => state.user.user.id)
  const user = utilityInfo?.currentWeek.find((item) => item.userId === userId)
  const group = useAppSelector((state) => state.group.group.members)

  const [userList, setUserList] = useState<UserList[]>([])

  useEffect(() => {
    if (!utilityInfo || !group) return

    const dayOfWeek = new Date().getDay()

    const exceedDueDate = dayOfWeek === 0 || dayOfWeek >= 5
    //dueDate 는 언제나 금요일인것으로 가정정

    const newUserList: UserList[] = group.map((item) => ({
      user: item,
      week: [],
    }))

    utilityInfo.weekList.slice(0, 6).forEach((item) => {
      item.paidUserIds?.forEach((paidUser) => {
        newUserList
          .find((user) => user.user.id === paidUser)
          ?.week.push({
            month: Number(item.month.slice(5)),
            week: item.week,
            finalStatus: 'complete',
          })
      })
      item.debtUserIds.forEach((debtUser) => {
        newUserList
          .find((user) => user.user.id === debtUser)
          ?.week.push({
            month: Number(item.month.slice(5)),
            week: item.week,
            finalStatus: exceedDueDate ? 'debt' : 'expected',
          })
      })
    })

    setUserList(newUserList)
  }, [utilityInfo, group])

  console.log('group', group)
  console.log('utilityInfo', utilityInfo)
  console.log('userList', userList)

  return (
    <>
      <BoxContainer>
        <ContentContainer>
          <TopDescription>전체 납부 현황</TopDescription>
          <BottomContainer>
            <MonthContainer>
              <MonthLabelsContainer>
                {utilityInfo?.weekList.map((item) => (
                  <MonthLabel key={item.week}>
                    <MonthText>
                      {item.month.slice(5)}-{item.week}
                    </MonthText>
                  </MonthLabel>
                ))}
                {Array.from({
                  length: 6 - (utilityInfo?.weekList.length || 0),
                }).map((_, index) => (
                  <MonthLabel key={index}>
                    <MonthText>&ensp;&ensp;</MonthText>
                  </MonthLabel>
                ))}
              </MonthLabelsContainer>
            </MonthContainer>
            <StepContainer>
              {userList.map((item) => (
                <StepItem key={item.user.id}>
                  <UserItem
                    user={item.user}
                    variant="bar"
                    size="small"
                  />
                  <BarContainer>
                    <StatusBarContainer>
                      {item.week.map((week) => (
                        <StatusContainer key={week.week}>
                          <StatusIcon
                            variant={week.finalStatus}
                            key={week.week}
                          />
                          <div>{t(`pledge.status.${week.finalStatus}`)}</div>
                        </StatusContainer>
                      ))}
                      {Array.from({ length: 6 - item.week.length }).map(
                        (_, index) => (
                          <StatusIcon
                            variant={'none'}
                            key={index}
                          />
                        ),
                      )}
                    </StatusBarContainer>
                  </BarContainer>
                </StepItem>
              ))}
            </StepContainer>
          </BottomContainer>
        </ContentContainer>
      </BoxContainer>
    </>
  )
}
