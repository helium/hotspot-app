import { combineReducers } from '@reduxjs/toolkit'
import statsSlice from './stats/statsSlice'
import userSlice from './user/userSlice'

const rootReducer = combineReducers({
  user: userSlice.reducer,
  stats: statsSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
