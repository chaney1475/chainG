import axios from 'axios'

import { ApiErrorResponse, ApiResponse } from '@/types/api'
import { Account, AccountDetail, TransferRequest } from '@/types/fintech'
import { handleFintechError } from '@/utils/error/handleFintechError'

import { postBooleanRequest, postRequest } from './api'

const fintechApi = axios.create({
  baseURL: `https://finopenapi.ssafy.io/ssafy/api/v1/edu`,
  // baseURL: `${process.env.NEXT_PUBLIC_FINTECH_BASEURL}:
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

fintechApi.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

fintechApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return handleFintechError(error)
  },
)

export default fintechApi

export const getFintechRequest = async <T>(
  url: string,
): Promise<ApiResponse<T>> => {
  try {
    const response = await fintechApi.get<ApiResponse<T>>(url)
    return response.data
  } catch (error) {
    return error as ApiErrorResponse
  }
}

export const getFintechBooleanRequest = async (
  url: string,
): Promise<boolean> => {
  const response = await getFintechRequest<unknown>(url)
  return response.success
}

export const postFintechRequest = async <T>(
  url: string,
  data?: object,
): Promise<ApiResponse<T>> => {
  try {
    const response = await fintechApi.post<ApiResponse<T>>(url, data)
    return response.data
  } catch (error) {
    return error as ApiErrorResponse
  }
}

export const postFintechBooleanRequest = async (
  url: string,
  data?: object,
): Promise<boolean> => {
  const response = await postFintechRequest<unknown>(url, data)
  return response.success
}

export const putFintechRequest = async <T>(
  url: string,
  data: object,
): Promise<ApiResponse<T>> => {
  try {
    const response = await fintechApi.put<ApiResponse<T>>(url, data)
    return response.data
  } catch (error) {
    return error as ApiErrorResponse
  }
}

export const patchFintechRequest = async <T>(
  url: string,
  data: object,
): Promise<ApiResponse<T>> => {
  try {
    const response = await fintechApi.patch<ApiResponse<T>>(url, data)
    return response.data
  } catch (error) {
    return error as ApiErrorResponse
  }
}

export const deleteFintechRequest = async <T>(
  url: string,
): Promise<ApiResponse<T>> => {
  try {
    const response = await fintechApi.delete<ApiResponse<T>>(url)
    return response.data
  } catch (error) {
    return error as ApiErrorResponse
  }
}

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
