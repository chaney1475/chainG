import { useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { format } from 'date-fns'

import { getDuties } from '@/apis/duty'
import { getLivingAccount } from '@/apis/livingBudget'
import { getPaymentCurrentStatus } from '@/apis/payment'
import { useAppSelector } from '@/hooks'
import { setDutyWeekList } from '@/store/slices/dutySlice'
import {
  setLivingAccountNo,
  setMyAccountNo,
} from '@/store/slices/livingBudgetSlice'
import { setPaymentCurrent } from '@/store/slices/pledgeSlice'
import { DayKey, Duty } from '@/types/duty'

import { DashBoard, LifeBudgetPreview, Notice } from '..'
import { Container, ContentsContainer } from './styles'

export function ConfirmedHomeContents() {
  const dispatch = useDispatch()
  const user = useAppSelector((state) => state.user.user)
  const livingBudget = useAppSelector((state) => state.livingBudget)
  const dutyWeekList = useAppSelector((state) => state.duty.dutyWeekList)
  const today = format(new Date(), 'EEEE').toLowerCase()

  const hasFetchedAccount = useRef(false)
  const hasFetchedDuties = useRef(false)
  const hasFetchedPaymentCurrent = useRef(false)
  const currentMonth = useMemo(() => format(new Date(), 'yyyyMM'), [])

  useEffect(() => {
    const fetchPaymentCurrent = async () => {
      if (hasFetchedPaymentCurrent.current) return
      hasFetchedPaymentCurrent.current = true
      if (!user.contractId) return

      const response = await getPaymentCurrentStatus(currentMonth)
      if (response.success) {
        dispatch(setPaymentCurrent(response.data))
      }
    }
    fetchPaymentCurrent()
  }, [user.contractId, currentMonth])

  useEffect(() => {
    const fetchAccount = async () => {
      if (hasFetchedAccount.current) return
      hasFetchedAccount.current = true
      if (!user.contractId) return
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
    if (!livingBudget.livingAccountNo || !livingBudget.myAccountNo) {
      fetchAccount()
    }
  }, [user.contractId, livingBudget.livingAccountNo, livingBudget.myAccountNo])

  useEffect(() => {
    const fetchDuties = async () => {
      if (hasFetchedDuties.current) return
      hasFetchedDuties.current = true
      if (!user.groupId) return
      const response = await getDuties(user.groupId) // dutyList
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
