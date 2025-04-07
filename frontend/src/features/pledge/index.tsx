'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import { getAccountDetail } from '@/apis/fintech'
import { getContract } from '@/apis/group'
import { retrieveRent, retrieveUtility } from '@/apis/payment'
import { BottomNavigation, TopHeader } from '@/components'
import { FloatingSwitchMenu } from '@/components'
import { PledgeMenuList } from '@/constants/FloatingSwitchMenu'
import { useFintechTime } from '@/hooks'
import { useGetAccountHistory } from '@/hooks'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setContract } from '@/store/slices/contractSlice'
import {
  setAccountDetail,
  setPaymentHistory,
  setRent,
  setUtility,
} from '@/store/slices/plegeSlice'
import { FormattedAccountPaymentHistory } from '@/types/fintech'
import { PledgeMenu } from '@/types/ui'
import {
  formatMoney,
  formatTransactionDate,
  formatTransactionTime,
} from '@/utils/format'

import { Account } from './account'
import { ContractDetail } from './contract'
import { RentPage } from './rent'
import { Container, FullMain } from './styles'
import { UtilityPage } from './utility'

export function PledgePage() {
  const dispatch = useDispatch()
  const rentInfo = useAppSelector((state) => state.pledge.rent)
  const utilityInfo = useAppSelector((state) => state.pledge.utility)
  const contract = useAppSelector((state) => state.contract.contract)
  const user = useAppSelector((state) => state.user.user)

  // retrieveRent 월세 월별 통계 조회
  useEffect(() => {
    if (!rentInfo) {
      const fetchRent = async () => {
        const response = await retrieveRent('2025-04')
        if (response.success) {
          dispatch(setRent(response.data))
          console.log('rent', response.data)
        }
      }
      fetchRent()
    }
  }, [rentInfo, dispatch])

  const [budgetStartDate, setBudgetStartDate] = useState(new Date())
  const [budgetEndDate, setBudgetEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
  )
  const { startDate, endDate } = useFintechTime(
    new Date(),
    budgetStartDate,
    budgetEndDate,
  )
  const rentAccountNo = useAppSelector(
    (state) => state.contract.contract.rent.rentAccountNo,
  )
  const getAccountHistory = useGetAccountHistory({
    accountNo: rentAccountNo,
    budgetStartDate: budgetStartDate,
    budgetEndDate: budgetEndDate,
  })

  const [formattedHistory, setFormattedHistory] = useState<
    FormattedAccountPaymentHistory[]
  >([])

  const handleBudgetChange = (date: Date) => {
    setBudgetStartDate(date)
    setBudgetEndDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))
  }

  const hasFetchedDetail = useRef(false)
  useEffect(() => {
    if (rentAccountNo && !hasFetchedDetail.current) {
      hasFetchedDetail.current = true
      fetchAccountDetail()
    }
  }, [rentAccountNo])

  const hasFetched = useRef(false)
  useEffect(() => {
    if (rentAccountNo && !hasFetched.current) {
      hasFetched.current = true
      fetchAccountPaymentHistory()
    }
  }, [rentAccountNo])

  const paymentHistory =
    useAppSelector((state) => state.pledge.account.paymentHistory) ?? []
  useEffect(() => {
    if (paymentHistory.length === 0) return
    let transactionDate = ''
    const history = paymentHistory.map((item) => {
      let showDate = false
      if (item.transactionDate != transactionDate) {
        showDate = true
        transactionDate = item.transactionDate
      }
      const isWithdrawal = item.transactionType === '1' ? '+' : '-'
      return {
        transactionUniqueNo: item.transactionUniqueNo,
        showDate: showDate,
        date: formatTransactionDate(item.transactionDate),
        time: formatTransactionTime(item.transactionTime),
        title: isWithdrawal + formatMoney(Number(item.transactionBalance)),
        transactionType: item.transactionType,
        transactionAfterBalance: formatMoney(item.transactionAfterBalance),
        transactionSummary: item.transactionSummary,
        transactionMemo: item.transactionMemo,
      }
    })
    setFormattedHistory(history)
  }, [paymentHistory])

  const fetchAccountPaymentHistory = async () => {
    const response = await getAccountHistory()
    dispatch(setPaymentHistory(response))
    hasFetched.current = false
  }

  const fetchAccountDetail = async () => {
    const response = await getAccountDetail(rentAccountNo)
    if (response.success) {
      dispatch(setAccountDetail(response.data.data))
    }
  }

  useEffect(() => {
    if (!utilityInfo) {
      const fetchUtility = async () => {
        const response = await retrieveUtility('2025-04')
        if (response.success) {
          dispatch(setUtility(response.data))
          console.log('utility', response.data)
        }
      }
      fetchUtility()
    }
  }, [utilityInfo, dispatch])

  useEffect(() => {
    const fetchContract = async () => {
      if (!contract) {
        if (user.contractId) {
          const response = await getContract(user.contractId)
          if (response.success) {
            dispatch(setContract(response.data))
          }
        }
      }
      fetchContract()
    }
  }, [contract, user.contractId, dispatch])

  const menuList = PledgeMenuList
  const [menu, setMenu] = useState<PledgeMenu>('contract')
  return (
    <Container variant={menu}>
      <TopHeader title={'서약 관리'} />
      <FullMain>
        {menu === 'contract' && <ContractDetail />}
        {menu === 'account' && rentAccountNo && startDate != '' && (
          <Account
            paymentHistory={formattedHistory}
            startDate={startDate}
            endDate={endDate}
            budgetDate={budgetStartDate}
            setBudgetDate={handleBudgetChange}
          />
        )}
        {menu === 'rent' && <RentPage />}
        {menu === 'utility' && <UtilityPage />}
        <FloatingSwitchMenu
          selectedMenu={menu}
          onSwitch={(menu) => setMenu(menu as PledgeMenu)}
          menuList={menuList}
        />
      </FullMain>

      <BottomNavigation />
    </Container>
  )
}
