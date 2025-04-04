import { Account, AccountDetail, TransferRequest } from '@/types/fintech'

import { postBooleanRequest, postRequest } from './api'

//transfer 생활비 송금
export const transfer = async (params: TransferRequest) =>
  await postBooleanRequest('/fintech/transfer', params)

//createAccount 계좌 생성
export const createAccount = async () =>
  await postRequest<{ data: Account }>('/fintech/account')

//getAccountDetail 계좌 조회(단건)
export const getAccountDetail = async () =>
  await postRequest<{ data: AccountDetail }>('/fintech/account')

//createCard 카드 생성
export const createCard = async ({ accountNo }: { accountNo: string }) =>
  await postRequest<{ id: string }>('/card', {
    accountNo,
  })
