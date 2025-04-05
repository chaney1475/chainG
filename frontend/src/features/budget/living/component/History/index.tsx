'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Button } from '@headlessui/react'

import { getAccountPaymentHistory } from '@/apis/fintech'
import { useFintechTime } from '@/hooks'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setLivingAccountPaymentHistory } from '@/store/slices/livingBudgetSlice'
import {
  AccountPaymentHistory,
  AccountPaymentHistoryRequest,
  AccountPaymentHistoryResponse,
  FintechResponseError,
} from '@/types/fintech'
import { formatMoney } from '@/utils/format'

export function History() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const livingAccountNo = useAppSelector(
    (state) => state.livingBudget.livingAccountNo,
  )
  const livingAccountPaymentHistory = useAppSelector(
    (state) => state.livingBudget.livingAccountPaymentHistory,
  )
  const [transmissionDate, transmissionTime, institutionTransactionUniqueNo] =
    useFintechTime(new Date())

  const [formattedHistory, setFormattedHistory] = useState<
    AccountPaymentHistory[]
  >([])

  useEffect(() => {
    let transactionDate = ''
    const paymentHistory = livingAccountPaymentHistory.map((item) => {
      let showDate = ''
      if (item.transactionDate !== transactionDate) {
        showDate = item.transactionDate
        transactionDate = item.transactionDate
      }
      return {
        ...item,
        transactionBalance: formatMoney(item.transactionBalance),
        transactionAfterBalance: formatMoney(item.transactionAfterBalance),
        transactionDate: showDate,
      }
    })
    setFormattedHistory(paymentHistory)
  }, [livingAccountPaymentHistory])
  const handleClick = async () => {
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
      startDate: '20250301',
      endDate: transmissionDate,
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
      dispatch(setLivingAccountPaymentHistory(response.REC.list))
    }
  }
  return (
    <div>
      <Button onClick={handleClick}>
        {t('contract.rentAccountNo.button')}
      </Button>
      <div>
        {formattedHistory &&
          formattedHistory.map((item) => (
            <div key={item.transactionUniqueNo}>
              {item.transactionDate}: {item.transactionTime} -
              {formatMoney(item.transactionAfterBalance)}-
              {formatMoney(item.transactionBalance)}-{item.transactionMemo}-
              {item.transactionTypeName}
            </div>
          ))}
      </div>
    </div>
  )
}
