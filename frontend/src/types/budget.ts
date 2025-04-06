import { DayKey } from "./duty"

export interface RetrieveRentResponse {
  totalAmount: number
  myAmount: number
  dueDate: number
  currentMonth: CurrentMonth[]
  monthList: MonthList[]
}

export interface RetrieveUtilityResponse {
  totalAmount: number
  myAmount: number
  dueDayOfWeek: DayKey
  currentWeek: CurrentWeek[]
  weekList: WeekList[]
}

export interface CurrentWeek {
  userId: number
  amount: number
  status: boolean
}

export interface WeekList {
  month: string
  week: number
  piadUserIds: number[]
  debtUserIds: number[]
}

export interface CurrentMonth {
  userId: number
  amount: number
  status: boolean
}

export interface MonthList {
  month: string
  piadUserIds: number[]
  debtUserIds: number[]
}

export interface TransferToOwnerRequest {
  month: number
  depositAccountNo: string
  transactionBalance: number
}

export interface DepositToRentAccountRequest {
  month: number
  withdrawalAccountNo: string
  transactionBalance: number
}

export type BudgetStatus = 'complete' | 'debt' | 'expected'
