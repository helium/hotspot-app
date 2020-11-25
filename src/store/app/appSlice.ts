import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import getUnixTime from 'date-fns/getUnixTime'

export type AppState = {
  lastIdle: number | null
  isLocked: boolean
}
const initialState: AppState = {
  lastIdle: null,
  isLocked: false,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateLastIdle: (state) => {
      state.lastIdle = getUnixTime(Date.now())
      return state
    },
    lock: (state, action: PayloadAction<boolean>) => {
      state.isLocked = action.payload
      if (!state.isLocked) {
        state.lastIdle = null
      }
      return state
    },
  },
})

export default appSlice
