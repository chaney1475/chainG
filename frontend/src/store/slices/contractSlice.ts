import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import {
  Contract,
  ContractRequest,
  CreateContractResponse,
} from '@/types/contract'

interface ContractState {
  contract: Contract
  contractRequest: ContractRequest
  createContractResponse: CreateContractResponse
}

const initialState: ContractState = {
  contract: {
    id: 0,
    startDate: '',
    endDate: '',
    rent: {
      totalAmount: 0,
      dueDate: 0,
      rentAccountNo: '',
      ownerAccountNo: '',
      totalRatio: 0,
      userPaymentInfo: [],
    },
    utility: {
      cardId: null,
    },
    status: 'pending',
    createdAt: '',
    updatedAt: '',
  },
  contractRequest: {
    startDate: '',
    endDate: '',
    rent: {
      totalAmount: 0,
      dueDate: 0,
      rentAccountNo: '',
      ownerAccountNo: '',
      totalRatio: 0,
      userPaymentInfo: [],
    },
    utility: {
      cardId: null,
    },
    status: 'pending',
  },
  createContractResponse: {
    id: 0,
    createdAt: '',
    updatedAt: '',
  },
}

const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setContract: (state, action: PayloadAction<Contract>) => {
      state.contract = action.payload
    },
    setContractRequest: (state, action: PayloadAction<ContractRequest>) => {
      state.contractRequest = action.payload
    },
    setCreateContractResponse: (
      state,
      action: PayloadAction<CreateContractResponse>,
    ) => {
      state.createContractResponse = action.payload
    },
  },
})

export const { setContract, setContractRequest, setCreateContractResponse } =
  contractSlice.actions
export default contractSlice.reducer
