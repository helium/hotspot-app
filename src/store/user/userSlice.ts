import { createSlice } from '@reduxjs/toolkit'

export type UserState = {
  isSignedIn: boolean
  hasFinishedEducation: boolean
  isSettingUpHotspot: boolean
}
const initialState: UserState = {
  isSignedIn: false,
  hasFinishedEducation: false,
  isSettingUpHotspot: false,
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
    setupHotspot: (state) => {
      state.hasFinishedEducation = true
      state.isSettingUpHotspot = true
      return state
    },
  },
})

export default userSlice
