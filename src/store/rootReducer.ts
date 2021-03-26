import { combineReducers } from '@reduxjs/toolkit'
import accountSlice from './account/accountSlice'
import appSlice from './user/appSlice'
import connectedHotspotSlice from './connectedHotspot/connectedHotspotSlice'
import heliumDataSlice from './helium/heliumDataSlice'
import hotspotDetailsSlice from './hotspotDetails/hotspotDetailsSlice'
import hotspotsSlice from './hotspots/hotspotsSlice'
import activitySlice from './activity/activitySlice'
import hotspotChecklistSlice from './hotspotDetails/hotspotChecklistSlice'
import networkHotspotsSlice from './networkHotspots/networkHotspotsSlice'
import discoverySlice from './discovery/discoverySlice'
import featuresSlice from './features/featuresSlice'
import hotspotOnboardingSlice from './hotspots/hotspotOnboardingSlice'

const rootReducer = combineReducers({
  app: appSlice.reducer,
  account: accountSlice.reducer,
  activity: activitySlice.reducer,
  connectedHotspot: connectedHotspotSlice.reducer,
  heliumData: heliumDataSlice.reducer,
  hotspotDetails: hotspotDetailsSlice.reducer,
  hotspots: hotspotsSlice.reducer,
  hotspotChecklist: hotspotChecklistSlice.reducer,
  networkHotspots: networkHotspotsSlice.reducer,
  discovery: discoverySlice.reducer,
  features: featuresSlice.reducer,
  hotspotOnboarding: hotspotOnboardingSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
