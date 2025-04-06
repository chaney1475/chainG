'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';



import { useRouter } from 'next/navigation';



import { getAccountDetail, getAccountPaymentHistory } from '@/apis/fintech';
import { notifyLeaderLivingAccountCreated } from '@/apis/livingBudget';
import { BudgetCalendar, FullNavLayout, Modal } from '@/components';
import { FloatingSwitchMenu } from '@/components';
import { useFintechTime, useIsLeader } from '@/hooks';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setLivingAccountDetail, setLivingAccountPaymentHistory } from '@/store/slices/livingBudgetSlice';
import { AccountPaymentHistoryRequest, AccountPaymentHistoryResponse, FintechResponseError, FormattedAccountPaymentHistory } from '@/types/fintech';
import { formatMoney, formatTransactionDate, formatTransactionTime } from '@/utils/format';



import { History } from './component';
import { Account, AccountInfo, AccountTitle, CalendarContainer } from './styles'





export function BudgetLivingPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const router = useRouter()
  const [budgetStartDate, setBudgetStartDate] = useState(new Date())
  const [budgetEndDate, setBudgetEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
  )
  const isLeader = useIsLeader()
  const [open, setOpen] = useState(false)
  const [
    transmissionDate,
    transmissionTime,
    institutionTransactionUniqueNo,
    startDate,
    endDate,
  ] = useFintechTime(new Date(), budgetStartDate, budgetEndDate)

  const livingAccountNo = useAppSelector(
    (state) => state.livingBudget.livingAccountNo,
  )
  const livingAccountDetail = useAppSelector(
    (state) => state.livingBudget.livingAccountDetail,
  )
  const livingAccountPaymentHistory = useAppSelector(
    (state) => state.livingBudget.livingAccountPaymentHistory,
  )
  const [formattedHistory, setFormattedHistory] = useState<
    FormattedAccountPaymentHistory[]
  >([])

  const handleBudgetChange = (date: Date) => {
    setBudgetStartDate(date)
    setBudgetEndDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))
  }

  const [sendNotification, setSendNotification] = useState(false)

  const handleSendNotification = async () => {
    if (!sendNotification) {
      await notifyLeaderLivingAccountCreated()
      setSendNotification(true)
    } else {
      setOpen(false)
    }
  }

  useEffect(() => {
    if (!livingAccountNo) {
      if (!isLeader) {
        setOpen(true)
      } else {
        router.push('/budget/living/create')
      }
    } else {
      fetchAccountDetail()
    }
  }, [livingAccountNo])

  useEffect(() => {
    if (livingAccountNo) {
      fetchAccountPaymentHistory()
    }
  }, [livingAccountNo, startDate, endDate])

  useEffect(() => {
    if (livingAccountPaymentHistory.length === 0) return
    let transactionDate = ''
    const paymentHistory = livingAccountPaymentHistory.map((item) => {
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
    setFormattedHistory(paymentHistory)
  }, [livingAccountPaymentHistory])

  const currentMonthDeposit = livingAccountPaymentHistory
    .filter((item) => item.transactionDate >= startDate)
    .filter((item) => item.transactionDate < endDate)
    .filter((item) => item.transactionType === '1')
    .reduce((acc, item) => acc + Number(item.transactionBalance), 0)

  const currentMonthWithdrawal = livingAccountPaymentHistory
    .filter((item) => item.transactionType === '2')
    .reduce((acc, item) => acc + Number(item.transactionBalance), 0)

  const fetchAccountPaymentHistory = async () => {
    const Request: AccountPaymentHistoryRequest = {
      Header: {
        apiName: 'inquireTransactionHistoryList',
        transmissionDate: transmissionDate,
        transmissionTime: transmissionTime,
        institutionCode: '00100',
        fintechAppNo: '001',
        apiServiceCode: 'inquireTransactionHistoryList',
        institutionTransactionUniqueNo: institutionTransactionUniqueNo,
        apiKey: 'a57e58879de94373856c981706ca1056',
        userKey: 'ed638cf5-675b-4e37-91c5-1ea6f5a92f67',
      },
      accountNo: livingAccountNo,
      startDate: startDate,
      endDate: endDate,
      transactionType: 'A',
      orderByType: 'ASC',
    }
    const response: AccountPaymentHistoryResponse | FintechResponseError =
      await getAccountPaymentHistory(Request)
    if (
      'Header' in response &&
      'REC' in response &&
      response.Header?.responseCode === 'H0000'
    ) {
      dispatch(setLivingAccountPaymentHistory(response.REC.list.reverse()))
    }
  }

  const fetchAccountDetail = async () => {
    const response = await getAccountDetail(livingAccountNo)
    if (response.success) {
      dispatch(setLivingAccountDetail(response.data.data))
    }
  }
  const menuList = [
    { id: 'calendar', name: '달력' },
    { id: 'history', name: '내역' },
  ]
  const [menu, setMenu] = useState<'calendar' | 'history'>('calendar')
  return (
    <FullNavLayout title={'생활비'}>
      <Account>
        <AccountTitle>생활비 계좌</AccountTitle>
        <AccountInfo>
          <span>{t('fintech.bankName') + ' ' + livingAccountNo}</span>
          <div>{formatMoney(livingAccountDetail.accountBalance)}</div>
        </AccountInfo>
      </Account>

      {menu === 'calendar' && (
        <CalendarContainer>
          <BudgetCalendar
            budgetDate={budgetStartDate}
            setBudgetDate={handleBudgetChange}
            currentMonthDeposit={currentMonthDeposit}
            currentMonthWithdrawal={currentMonthWithdrawal}
            paymentHistory={formattedHistory}
          />
        </CalendarContainer>
      )}
      {menu === 'history' && (
        <History
          paymentHistory={formattedHistory}
          startDate={startDate}
          endDate={endDate}
        />
      )}
      <FloatingSwitchMenu
        selectedMenu={menu}
        onSwitch={(menu) => setMenu(menu as 'calendar' | 'history')}
        menuList={menuList}
      />

      <Modal
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleSendNotification}
        title="생활비 계좌 생성 요청"
        description={
          sendNotification
            ? '생활비 계좌 생성이 완료되었습니다'
            : '방장에게 생활비 계좌\b생성을 요청하시겠습니까?'
        }
        confirmText={sendNotification ? '확인' : '요청'}
      />
    </FullNavLayout>
  )
}