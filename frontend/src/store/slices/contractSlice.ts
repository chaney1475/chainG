import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import {
  Contract,
  ContractRequest,
  CreateContractResponse,
  Rent,
  Utility,
} from '@/types/contract'

interface ContractState {
  contract: Contract
  contractRequest: ContractRequest
  createContractResponse: CreateContractResponse
  showRentRatio: boolean
  rentAccountConfirm: boolean
  cardConfirm: boolean
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
  showRentRatio: false,
  rentAccountConfirm: false,
  cardConfirm: false,
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
    setShowRentRatio: (state, action: PayloadAction<boolean>) => {
      state.showRentRatio = action.payload
    },
    updateRent: (state, action: PayloadAction<Rent>) => {
      state.contractRequest.rent = action.payload
    },
    updateRentField: (
      state,
      action: PayloadAction<{
        field: keyof Rent
        value: Rent[keyof Rent]
      }>,
    ) => {
      const { field, value } = action.payload
      state.contractRequest.rent[field] = value
    },
    updateContractRequestField: (
      state,
      action: PayloadAction<{
        field: keyof ContractRequest
        value: ContractRequest[keyof ContractRequest]
      }>,
    ) => {
      const { field, value } = action.payload
      state.contractRequest[field] = value
    },
    setRentAccountConfirm: (state, action: PayloadAction<boolean>) => {
      state.rentAccountConfirm = action.payload
    },
    setCardConfirm: (state, action: PayloadAction<boolean>) => {
      state.cardConfirm = action.payload
    },
    updateUtility: (state, action: PayloadAction<Utility>) => {
      state.contractRequest.utility = action.payload
    },
  },
})

export const {
  setContract,
  setContractRequest,
  setCreateContractResponse,
  setShowRentRatio,
  updateRent,
  updateRentField,
  updateContractRequestField,
  setRentAccountConfirm,
  setCardConfirm,
  updateUtility,
} = contractSlice.actions

export default contractSlice.reducer
