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
  month: monthPaid[]
}

interface monthPaid {
  month: number
  finalStatus: BudgetStatus
}

export function Step() {
  const { t } = useTranslation()
  const rentInfo = useAppSelector((state) => state.pledge.rent)
  const group = useAppSelector((state) => state.group.group.members)

  const [userList, setUserList] = useState<UserList[]>([])

  useEffect(() => {
    if (!rentInfo || !group) return

    const date = new Date().getDate()
    const dutDate = rentInfo.dueDate || 0
    const exceedDueDate: boolean = dutDate < date

    const newUserList: UserList[] = group.map((item) => ({
      user: item,
      month: [],
    }))

    rentInfo.monthList.slice(0, 6).forEach((item) => {
      item.paidUserIds?.forEach((paidUser) => {
        newUserList
          .find((user) => user.user.id === paidUser)
          ?.month.push({
            month: Number(item.month.slice(5)),
            finalStatus: 'complete',
          })
      })
      item.debtUserIds.forEach((debtUser) => {
        newUserList
          .find((user) => user.user.id === debtUser)
          ?.month.push({
            month: Number(item.month.slice(5)),
            finalStatus: exceedDueDate ? 'debt' : 'expected',
          })
      })
    })

    setUserList(newUserList)
  }, [rentInfo, group])

  return (
    <>
      <BoxContainer>
        <ContentContainer>
          <TopDescription>전체 납부 현황</TopDescription>
          <BottomContainer>
            <MonthContainer>
              <MonthLabelsContainer>
                {rentInfo?.monthList.map((item) => (
                  <MonthLabel key={item.month}>
                    <MonthText>{item.month.slice(5)}월</MonthText>
                  </MonthLabel>
                ))}
                {Array.from({
                  length: 6 - (rentInfo?.monthList.length || 0),
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
                    showName={true}
                  />
                  <BarContainer>
                    <StatusBarContainer>
                      {item.month.map((month) => (
                        <StatusContainer key={month.month}>
                          <StatusIcon variant={month.finalStatus} />
                          <div>{t(`pledge.status.${month.finalStatus}`)}</div>
                        </StatusContainer>
                      ))}
                      {Array.from({ length: 6 - item.month.length }).map(
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
