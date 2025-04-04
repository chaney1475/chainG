export interface TransferRequest {
  fromAccountNo: string
  toAccountNo: string
  amount: number
}

export interface AccountDetail {
  bankCode: string
  bankName: string
  userName: string
  accountNo: string
  accountName: string
  accountTypeCode: string
  accountTypeName: string
  accountCreatedDate: string
  accountExpiryDate: string
  dailyTransferLimit: string
  oneTimeTransferLimit: string
  accountBalance: string
  lastTransactionDate: string
  currency: string
}

export interface Account {
  accountNo: string
  bankCode: string
  currency: {
    currency: string
    currencyName: string
  }
}
