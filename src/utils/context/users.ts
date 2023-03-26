import { createSlice } from '@reduxjs/toolkit'

interface InitialState {
    currentUser: string
}
const initialState: InitialState = {
    currentUser: '',
}

const userReducer = createSlice({
    name: 'userReducer',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.currentUser = action.payload
        },
    },
})

export const { setUser } = userReducer.actions
export default userReducer.reducer
