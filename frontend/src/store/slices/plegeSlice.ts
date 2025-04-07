import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RetrieveRentResponse, RetrieveUtilityResponse } from '@/types/budget'
import { AccountDetail, AccountPaymentHistory } from '@/types/fintech'

interface PledgeState {
  rent: RetrieveRentResponse | null
  utility: RetrieveUtilityResponse | null
  contract: null //TODO: 추후 추가
  account: {
    accountDetail: AccountDetail
    paymentHistory: AccountPaymentHistory[]
  }
}

const initialState: PledgeState = {
  rent: null,
  utility: null,
  contract: null,
  account: {
    accountDetail: {
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
    paymentHistory: [],
  },
}

const pledgeSlice = createSlice({
  name: 'pledge',
  initialState,
  reducers: {
    setRent: (state, action: PayloadAction<RetrieveRentResponse>) => {
      state.rent = action.payload
    },
    setUtility: (state, action: PayloadAction<RetrieveUtilityResponse>) => {
      state.utility = action.payload
    },
    setAccountDetail: (state, action: PayloadAction<AccountDetail>) => {
      state.account.accountDetail = action.payload
    },
    setPaymentHistory: (
      state,
      action: PayloadAction<AccountPaymentHistory[]>,
    ) => {
      state.account.paymentHistory = action.payload
    },
  },
})

export const { setRent, setUtility, setAccountDetail, setPaymentHistory } =
  pledgeSlice.actions
export default pledgeSlice.reducer
