import axios from 'axios'

import store from '@/store/store'
import { RootState } from '@/store/store'
import { signUpRequest } from '@/types/auth'
import { handleDefaultError } from '@/utils/error/handleDefaultError'

import api from './api'

const signUpApi = axios.create({
  baseURL: `https://chaing.site/api/v1`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

signUpApi.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.error('🚨 요청 오류:', error)
    return Promise.reject(error)
  },
)

signUpApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return handleDefaultError(error)
  },
)

export const signUp = async (params: signUpRequest) => {
  try {
    const response = await signUpApi.post('/auth/signup', params)
    console.log('response', response)
    return response.data
  } catch (error) {
    return null
  }
}

// export const insertFCMToken = async (params: { token: string }) => {
//   try {
//     const response = await api.post('/fcm', params)
//     return response
//   } catch (error) {
//     return null
//   }
// }
