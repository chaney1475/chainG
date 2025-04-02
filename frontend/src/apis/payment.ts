import { CreateAccountResponse } from '@/types/contract'

import { postRequest, putRequest } from './api'

//transfer
//POST / api / v1 / fintech / transfer

//createAccount
export const createAccount = async () =>
  await postRequest<CreateAccountResponse>('/fintech/account')

//createCard
export const createCard = async ({ accountNo }: { accountNo: string }) =>
  await postRequest<{ id: string }>('/card', {
    accountNo,
  })

//retrieveRent
//GET / api / v1 / payment / rent
