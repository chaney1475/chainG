import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { Invite } from '@/types/group'

interface GroupState {
  create: Invite
}

const initialState: GroupState = {
  create: {
    inviteCode: '',
    profileImage: '',
    nickname: '',
  },
}

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    setInviteCode: (state, action: PayloadAction<string>) => {
      state.create.inviteCode = action.payload
    },
    setProfileImage: (state, action: PayloadAction<string>) => {
      state.create.profileImage = action.payload
    },
    setNickname: (state, action: PayloadAction<string>) => {
      state.create.nickname = action.payload
    },
  },
})

export const { setInviteCode, setProfileImage, setNickname } =
  groupSlice.actions
export default groupSlice.reducer
