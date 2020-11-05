import { createSlice } from '@reduxjs/toolkit'

export type UserState = {
  isSignedIn: boolean
}
const initialState: UserState = { isSignedIn: false }

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    createUser: (state) => {
      state.isSignedIn = true
      return state
    },
  },
})

export default userSlice
