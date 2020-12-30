import { combineReducers } from '@reduxjs/toolkit'
import accountSlice from './account/accountSlice'
import appSlice from './user/appSlice'
import connectedHotspotSlice from './connectedHotspot/connectedHotspotSlice'

const rootReducer = combineReducers({
  app: appSlice.reducer,
  account: accountSlice.reducer,
  connectedHotspot: connectedHotspotSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
