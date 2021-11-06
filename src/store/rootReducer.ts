import { combineReducers } from '@reduxjs/toolkit'
import accountSlice from './account/accountSlice'
import appSlice from './user/appSlice'
import connectedHotspotSlice from './connectedHotspot/connectedHotspotSlice'
import heliumDataSlice from './helium/heliumDataSlice'
import heliumStatusSlice from './helium/heliumStatusSlice'
import hotspotDetailsSlice from './hotspotDetails/hotspotDetailsSlice'
import hotspotsSlice from './hotspots/hotspotsSlice'
import hotspotSearchSlice from './hotspotSearch/hotspotSearchSlice'
import validatorsSlice from './validators/validatorsSlice'
import rewardsSlice from './rewards/rewardsSlice'
import activitySlice from './activity/activitySlice'
import hotspotChecklistSlice from './hotspotDetails/hotspotChecklistSlice'
import discoverySlice from './discovery/discoverySlice'
import featuresSlice from './features/featuresSlice'
import locationSlice from './location/locationSlice'
import hotspotOnboardingSlice from './hotspots/hotspotOnboardingSlice'
import notificationSlice from './notifications/notificationSlice'

const rootReducer = combineReducers({
  app: appSlice.reducer,
  account: accountSlice.reducer,
  activity: activitySlice.reducer,
  connectedHotspot: connectedHotspotSlice.reducer,
  heliumData: heliumDataSlice.reducer,
  hotspotDetails: hotspotDetailsSlice.reducer,
  hotspots: hotspotsSlice.reducer,
  hotspotSearch: hotspotSearchSlice.reducer,
  hotspotChecklist: hotspotChecklistSlice.reducer,
  validators: validatorsSlice.reducer,
  rewards: rewardsSlice.reducer,
  discovery: discoverySlice.reducer,
  features: featuresSlice.reducer,
  location: locationSlice.reducer,
  status: heliumStatusSlice.reducer,
  hotspotOnboarding: hotspotOnboardingSlice.reducer,
  notifications: notificationSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
