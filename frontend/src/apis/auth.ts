import { signUpRequest } from '@/types/auth'

import api from './api'

export const signUp = async (params: signUpRequest) => {
  try {
    const response = await api.post('/auth/signUp', params)
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
