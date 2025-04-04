import { User } from './user'

export interface Contract {
  id: number
  startDate: string
  endDate: string
  rent: Rent
  utility: Utility
  status: ContractStatus
  createdAt: string
  updatedAt: string
}

export type ContractRequest = Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>

export type CreateContractResponse = Pick<
  Contract,
  'id' | 'createdAt' | 'updatedAt'
>

export interface Rent {
  totalAmount: number
  dueDate: number
  rentAccountNo: string
  ownerAccountNo: string
  totalRatio: number
  userPaymentInfo: UserPaymentInfo[]
}

export interface UserPaymentInfo {
  userId: number
  amount: number
  ratio: number
}

export interface Utility {
  cardId: number | null
}

export const ContractStatus = {
  none: 'none',
  draft: 'draft',
  isContractApproved: 'isContractApproved',
  pending: 'pending',
  reviewRequired: 'reviewRequired',
  confirm: 'confirm',
} as const

export type ContractStatus =
  (typeof ContractStatus)[keyof typeof ContractStatus]

export interface ContractUser extends User {
  approved: boolean
  status: ContractStatus
}

export interface Card {
  accountNo: string
  cardId: string
}

export interface CreateAccountResponse {
  data: {
    accountNo: string
    bankCode: string
    currency: {
      currency: string
      currencyName: string
    }
  }
}
