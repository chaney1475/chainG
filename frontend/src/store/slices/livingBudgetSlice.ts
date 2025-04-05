import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AccountDetail, AccountPaymentHistory } from '@/types/fintech'

interface LivingBudgetState {
  myAccountNo: string // 내 계좌
  livingAccountNo: string // 생활비 계좌
  livingAccountPaymentHistory: AccountPaymentHistory[]
  livingAccountDetail: AccountDetail
}

const initialState: LivingBudgetState = {
  myAccountNo: '',
  livingAccountNo: '',
  livingAccountPaymentHistory: [],
  livingAccountDetail: {
    bankCode: '',
    bankName: '',
    userName: '',
    accountNo: '',
    accountName: '',
    accountTypeCode: '',
    accountTypeName: '',
    accountCreatedDate: '',
    accountExpiryDate: '',
    dailyTransferLimit: '',
    oneTimeTransferLimit: '',
    accountBalance: '',
    lastTransactionDate: '',
    currency: '',
  },
}

const livingBudgetSlice = createSlice({
  name: 'livingBudget',
  initialState,
  reducers: {
    setMyAccountNo: (state, action: PayloadAction<string>) => {
      state.myAccountNo = action.payload
    },
    setLivingAccountNo: (state, action: PayloadAction<string>) => {
      state.livingAccountNo = action.payload
    },
    setLivingAccountPaymentHistory: (
      state,
      action: PayloadAction<AccountPaymentHistory[]>,
    ) => {
      state.livingAccountPaymentHistory = action.payload
    },
    setLivingAccountDetail: (state, action: PayloadAction<AccountDetail>) => {
      state.livingAccountDetail = action.payload
    },
  },
})

export const {
  setMyAccountNo,
  setLivingAccountNo,
  setLivingAccountPaymentHistory,
  setLivingAccountDetail,
} = livingBudgetSlice.actions
export default livingBudgetSlice.reducer
