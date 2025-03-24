import axios from 'axios'

import { handleDefaultError } from '@/utils/error/handleDefaultError'

interface Login {
  accessToken: string
}

const authApi = axios.create({
  baseURL: 'http://chaing.site',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

authApi.interceptors.request.use(
  (config) => {
    console.log('📤 요청 보냄:', config.url)
    return config
  },
  (error) => {
    console.error('🚨 요청 오류:', error)
    return Promise.reject(error)
  },
)

authApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return handleDefaultError(error)
  },
)

export default authApi

export const socialLogin = async (params: Login) => {
  try {
    const response = await authApi.post('/auth/login/kakao', params)
    return response.data
  } catch (error) {
    return null
  }
}

// export const login = async (params: Login) => {
//   try {
//     const response = await authApi.post('/auth/login/kakao', params)
//     return response.data
//   } catch (error) {
//     return null
//   }
// }

export const signUp = async (params: Login) => {
  try {
    const response = await authApi.post('/apis/v1/auth/signup', params)
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
