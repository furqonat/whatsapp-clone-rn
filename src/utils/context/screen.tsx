import { createSlice } from '@reduxjs/toolkit'

interface ScreenState {
    name: string
}

const initialState: ScreenState = {
    name: '',
}

const headerReducer = createSlice({
    name: 'header',
    initialState,
    reducers: {
        setScreenName: (state, action) => {
            state.name = action.payload
        },
    },
})

export const { setScreenName } = headerReducer.actions
export default headerReducer.reducer
