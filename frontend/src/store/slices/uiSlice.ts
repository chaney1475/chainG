import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { NavItemVariant } from '@/types/nav'

interface UiState {
  selectedNavItem: NavItemVariant
}

const initialState: UiState = {
  selectedNavItem: NavItemVariant.home,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedNavItem: (state, action: PayloadAction<NavItemVariant>) => {
      state.selectedNavItem = action.payload
    },
  },
})

export const { setSelectedNavItem } = uiSlice.actions
export default uiSlice.reducer
