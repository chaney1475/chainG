import { RetrieveRentResponse, RetrieveUtilityResponse } from '@/types/budget'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface PledgeState {
    rent: RetrieveRentResponse | null
    utility: RetrieveUtilityResponse | null
    contract: null //TODO: 추후 추가
    account: null //TODO: 추후 추가
}

const initialState: PledgeState = {
    rent: null,
    utility: null,
    contract: null,
    account: null,
}

const pledgeSlice = createSlice({
    name: 'pledge',
    initialState,
    reducers: {
        setRent: (state, action: PayloadAction<RetrieveRentResponse>) => {
            state.rent = action.payload
        },
        setUtility: (state, action: PayloadAction<RetrieveUtilityResponse>) => {
            state.utility = action.payload
        },
    },
})

export const { setRent, setUtility } = pledgeSlice.actions
export default pledgeSlice.reducer


