import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { DutyWeekList } from '@/types/duty'

interface DutyState {
  dutyWeekList: DutyWeekList
}

const initialState: DutyState = {
  dutyWeekList: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  },
}

const dutySlice = createSlice({
  name: 'duty',
  initialState,
  reducers: {
    setDutyWeekList: (state, action: PayloadAction<DutyWeekList>) => {
      state.dutyWeekList = action.payload
    },
  },
})

export const { setDutyWeekList } = dutySlice.actions
export default dutySlice.reducer
