import { configureStore, Action, getDefaultMiddleware } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'
import { useDispatch, useStore } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import { persistReducer } from 'redux-persist'
import rootReducer, { RootState } from './rootReducer'
import Reactotron from '../../ReactotronConfig'
import connectedHotspotSlice from './connectedHotspot/connectedHotspotSlice'
import hotspotOnboardingSlice from './hotspots/hotspotOnboardingSlice'
import heliumStatusSlice from './helium/heliumStatusSlice'
import discoverySlice from './discovery/discoverySlice'
import rewardsSlice from './rewards/rewardsSlice'
import accountSlice from './account/accountSlice'
import activitySlice from './activity/activitySlice'
import hotspotsSlice from './hotspots/hotspotsSlice'
import hotspotDetailsSlice from './hotspotDetails/hotspotDetailsSlice'
import hotspotSearchSlice from './hotspotSearch/hotspotSearchSlice'
import validatorsSlice from './validators/validatorsSlice'

const enhancers = []
if (Reactotron.createEnhancer) {
  enhancers.push(Reactotron.createEnhancer())
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [
    accountSlice.name, // persisted individually in rootReducer.ts
    activitySlice.name, // persisted individually in rootReducer.ts
    hotspotsSlice.name, // persisted individually in rootReducer.ts
    discoverySlice.name, // persisted individually in rootReducer.ts
    validatorsSlice.name, // persisted individually in rootReducer.ts
    connectedHotspotSlice.name,
    hotspotOnboardingSlice.name,
    heliumStatusSlice.name,
    rewardsSlice.name,
    hotspotDetailsSlice.name,
    hotspotSearchSlice.name,
  ],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  enhancers,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false,
    // TODO: The BigNumber type in some models is not serializable. Ignoring the warning for now.
  }),
})

export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type AppStore = typeof store
export const useAppStore = () => useStore<AppStore>()

export default store
