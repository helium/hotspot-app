import { createSlice } from '@reduxjs/toolkit'

export type UserState = {
  isSignedIn: boolean
  hasFinishedEducation: boolean
}
const initialState: UserState = {
  isSignedIn: false,
  hasFinishedEducation: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn: (state) => {
      state.isSignedIn = true
      return state
    },
    finishEducation: (state) => {
      state.hasFinishedEducation = true
      return state
    },
  },
})

export default userSlice
