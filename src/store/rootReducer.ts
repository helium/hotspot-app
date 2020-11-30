import { combineReducers } from '@reduxjs/toolkit'
import accountSlice from './account/accountSlice'
import statsSlice from './stats/statsSlice'
import userSlice from './user/userSlice'

const rootReducer = combineReducers({
  user: userSlice.reducer,
  account: accountSlice.reducer,
  stats: statsSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
