import { User } from './user'

export interface Contract {
  id: number
  startDate: string
  endDate: string
  rent: Rent
  utility: Utility
  status: ContractStatusType
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
  id: number
  amount: number
  ratio: number
}

export interface Utility {
  cardId: number | null
}

export const ContractStatus = {
  draft: 'draft',
  confirm: 'confirm',
  pending: 'pending',
  reviewRequired: 'reviewRequired',
} as const

export type ContractStatusType =
  (typeof ContractStatus)[keyof typeof ContractStatus]

export interface ContractUser extends User {
  approved: boolean
  status: ContractStatusType
}

export interface Card {
  accountNo: string
  cardId: string
}
