import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { LoginUser, User } from '@/types/user'

interface UserState {
  user: LoginUser
}

const initialState: UserState = {
  user: {
    id: 0,
    name: '',
    nickname: '',
    profileImage: '',
    groupId: 0,
    contractId: 0,
  },
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<LoginUser>) => {
      state.user = action.payload
    },
    setUserNickname: (state, action: PayloadAction<string>) => {
      state.user.nickname = action.payload
    },
    setUserProfileImage: (state, action: PayloadAction<string>) => {
      state.user.profileImage = action.payload
    },
    setGroupId: (state, action: PayloadAction<number>) => {
      state.user.groupId = action.payload
    },
    setContractId: (state, action: PayloadAction<number>) => {
      state.user.contractId = action.payload
    },
  },
})

export const {
  setUser,
  setUserNickname,
  setUserProfileImage,
  setGroupId,
  setContractId,
} = userSlice.actions

export default userSlice.reducer
