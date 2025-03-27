import axios from 'axios'

import { store } from '@/store/store'
import { RootState } from '@/store/store'
import { handleDefaultError } from '@/utils/error/handleDefaultError'

const api = axios.create({
  baseURL: `https://chaing.site/api/v1`,
  // baseURL: `${process.env.NEXT_PUBLIC_FRONTEND_SCHEME}://${process.env.NEXT_PUBLIC_FRONTEND_HOST}${process.env.NEXT_PUBLIC_FRONTEND_PATH}`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const state: RootState = store.getState()
    const accessToken = state.auth.loginToken.accessToken
    if (accessToken) {
      config.headers = config.headers || {}
      config.headers.Authorization = accessToken
    } else {
      delete config.headers.accessToken
    }

    return config
  },
  (error) => {
    console.error('🚨 요청 오류:', error)
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return handleDefaultError(error)
  },
)

export default api
