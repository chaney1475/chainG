import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface LivingBudgetState {
  myAccountNo: string // 내 계좌
  livingAccountNo: string // 생활비 계좌
}

const initialState: LivingBudgetState = {
  myAccountNo: '',
  livingAccountNo: '',
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
  },
})

export const { setMyAccountNo, setLivingAccountNo } = livingBudgetSlice.actions
export default livingBudgetSlice.reducer
