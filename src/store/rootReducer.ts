import { combineReducers } from '@reduxjs/toolkit'
import { createMigrate, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
import accountSlice from './account/accountSlice'
import appSlice from './user/appSlice'
import connectedHotspotSlice from './connectedHotspot/connectedHotspotSlice'
import heliumDataSlice from './helium/heliumDataSlice'
import heliumStatusSlice from './helium/heliumStatusSlice'
import hotspotDetailsSlice from './hotspotDetails/hotspotDetailsSlice'
import hotspotsSlice, {
  hotspotsSliceMigrations,
} from './hotspots/hotspotsSlice'
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

const discoveryConfig = {
  key: discoverySlice.name,
  storage: AsyncStorage,
  whitelist: ['hotspotsForHexId'],
}

const hotspotsConfig = {
  key: hotspotsSlice.name,
  storage: AsyncStorage,
  blacklist: ['rewards'],
  version: 0,
  migrate: createMigrate(hotspotsSliceMigrations, { debug: false }),
}

const accountConfig = {
  key: accountSlice.name,
  storage: AsyncStorage,
  blacklist: ['rewardsSum'],
}

const activityConfig = {
  key: activitySlice.name,
  storage: AsyncStorage,
  blacklist: ['filter', 'detailTxn', 'requestMore'],
}

const validatorsConfig = {
  key: validatorsSlice.name,
  storage: AsyncStorage,
  blacklist: ['rewards'],
}

const rootReducer = combineReducers({
  app: appSlice.reducer,
  account: persistReducer(accountConfig, accountSlice.reducer),
  activity: persistReducer(activityConfig, activitySlice.reducer),
  connectedHotspot: connectedHotspotSlice.reducer,
  heliumData: heliumDataSlice.reducer,
  hotspotDetails: hotspotDetailsSlice.reducer,
  hotspots: persistReducer(hotspotsConfig, hotspotsSlice.reducer),
  hotspotSearch: hotspotSearchSlice.reducer,
  hotspotChecklist: hotspotChecklistSlice.reducer,
  validators: persistReducer(validatorsConfig, validatorsSlice.reducer),
  rewards: rewardsSlice.reducer,
  discovery: persistReducer(discoveryConfig, discoverySlice.reducer),
  features: featuresSlice.reducer,
  location: locationSlice.reducer,
  status: heliumStatusSlice.reducer,
  hotspotOnboarding: hotspotOnboardingSlice.reducer,
  notifications: notificationSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
