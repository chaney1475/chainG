import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RetrieveRentResponse, RetrieveUtilityResponse } from '@/types/budget'
import { AccountDetail, AccountPaymentHistory } from '@/types/fintech'
import { PledgeMenu } from '@/types/ui'

interface PledgeState {
  rent: RetrieveRentResponse | null
  utility: RetrieveUtilityResponse | null
  contract: null //TODO: 추후 추가
  account: {
    accountDetail: AccountDetail
    paymentHistory: AccountPaymentHistory[]
  }
  selectedMenu: PledgeMenu
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
  selectedMenu: PledgeMenu.contract,
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
    setSelectedMenu: (state, action: PayloadAction<PledgeMenu>) => {
      state.selectedMenu = action.payload
    },
  },
})

export const {
  setRent,
  setUtility,
  setAccountDetail,
  setPaymentHistory,
  setSelectedMenu,
} = pledgeSlice.actions
export default pledgeSlice.reducer
