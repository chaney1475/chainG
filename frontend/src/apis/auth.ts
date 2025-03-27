import axios from 'axios'

import { setAccessToken } from '@/store/slices/authSlice'
import { store } from '@/store/store'
import { signUpRequest } from '@/types/auth'
import { handleDefaultError } from '@/utils/error/handleDefaultError'

interface LoginForm {
  emailAddress: string
  password: string
}

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

export const login = async (params: LoginForm) => {
  try {
    const response = await signUpApi.post('/auth/login', params)
    const token = response.headers['authorization'] // 소문자 주의
    store.dispatch(setAccessToken(token))
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
