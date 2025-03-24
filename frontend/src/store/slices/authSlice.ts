import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { ISocialLogin } from '@/types/auth'

interface AuthState {
  FCMToken: string | null
  loginToken: ISocialLogin
}

const initialState: AuthState = {
  FCMToken: null,
  loginToken: {
    accessToken: null,
    expiresIn: null,
    refreshToken: null,
  },
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.loginToken.accessToken = action.payload
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.loginToken.refreshToken = action.payload
    },
    setExpiresIn: (state, action: PayloadAction<number>) => {
      state.loginToken.expiresIn = action.payload
    },
    clearTokens: (state) => {
      Object.assign(state, initialState)
    },
    setFCMToken: (state, action: PayloadAction<string>) => {
      state.FCMToken = action.payload
    },
  },
})

export const {
  setAccessToken,
  setRefreshToken,
  setExpiresIn,
  setFCMToken,
  clearTokens,
} = authSlice.actions
export default authSlice.reducer
