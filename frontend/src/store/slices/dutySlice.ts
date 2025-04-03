import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { DayKey, Duty, DutyWeekList } from '@/types/duty'

interface DutyState {
  dutyWeekList: DutyWeekList
  editDuty: Duty | null
  createDayOfWeek: DayKey | null
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
  editDuty: null,
  createDayOfWeek: null,
}

const dutySlice = createSlice({
  name: 'duty',
  initialState,
  reducers: {
    setDutyWeekList: (state, action: PayloadAction<DutyWeekList>) => {
      state.dutyWeekList = action.payload
    },

    removeDutyFromList: (state, action: PayloadAction<Duty>) => {
      const { dayOfWeek, id } = action.payload
      state.dutyWeekList[dayOfWeek] = state.dutyWeekList[dayOfWeek].filter(
        (duty) => duty.id !== id,
      )
    },
    setEditDuty: (state, action: PayloadAction<Duty>) => {
      state.editDuty = action.payload
    },
    clearEditDuty: (state) => {
      state.editDuty = null
    },
    setCreateDayOfWeek: (state, action: PayloadAction<DayKey>) => {
      state.createDayOfWeek = action.payload
    },
    clearCreateDayOfWeek: (state) => {
      state.createDayOfWeek = null
    },
  },
})

export const {
  setDutyWeekList,
  removeDutyFromList,
  setEditDuty,
  clearEditDuty,
  setCreateDayOfWeek,
  clearCreateDayOfWeek,
} = dutySlice.actions
export default dutySlice.reducer
