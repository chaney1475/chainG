import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { format } from 'date-fns'

import { getDuties } from '@/apis/duty'
import { getLivingAccount } from '@/apis/livingBudget'
import { useAppSelector } from '@/hooks'
import { setDutyWeekList } from '@/store/slices/dutySlice'
import {
  setLivingAccountNo,
  setMyAccountNo,
} from '@/store/slices/livingBudgetSlice'
import { DayKey, Duty } from '@/types/duty'

import { DashBoard, LifeBudgetPreview, Notice } from '..'
import { Container, ContentsContainer } from './styles'

export function ConfirmedHomeContents() {
  const dispatch = useDispatch()
  const user = useAppSelector((state) => state.user.user)
  const livingBudget = useAppSelector((state) => state.livingBudget)
  const dutyWeekList = useAppSelector((state) => state.duty.dutyWeekList)
  const today = format(new Date(), 'EEEE').toLowerCase()
  const fetchAccount = useCallback(async () => {
    console.log('fetchAccount 호출됨', !user.contractId)
    if (!user.contractId) return
    if (!livingBudget.livingAccountNo || !livingBudget.myAccountNo) {
      const response = await getLivingAccount()
      if (response.success) {
        if (response.data.myAccountNo) {
          dispatch(setMyAccountNo(response.data.myAccountNo))
        }
        if (response.data.liveAccountNo) {
          dispatch(setLivingAccountNo(response.data.liveAccountNo))
        }
      }
    }
  }, [user.contractId, livingBudget, dispatch])

  useEffect(() => {
    fetchAccount()
  }, [user.contractId])

  useEffect(() => {
    const fetchDuties = async () => {
      if (!user.groupId) return
      const response = await getDuties(user.groupId) // dutyList
      console.log(response)
      if (response.success) {
        dispatch(setDutyWeekList(response.data))
      }
    }
    fetchDuties()
  }, [user.groupId])

  const todayMyDutyList = useMemo(
    () =>
      dutyWeekList[today as DayKey] &&
      dutyWeekList[today as DayKey]?.filter((duty: Duty) =>
        duty.assignees.includes(user.id),
      ),
    [dutyWeekList],
  )

  return (
    <Container>
      <Notice />
      <ContentsContainer>
        <DashBoard todayMyDutyList={todayMyDutyList} />
        {livingBudget.livingAccountNo && <LifeBudgetPreview />}
      </ContentsContainer>
    </Container>
  )
}
