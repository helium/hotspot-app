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

const enhancers = []
if (Reactotron.createEnhancer) {
  enhancers.push(Reactotron.createEnhancer())
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [
    connectedHotspotSlice.name,
    hotspotOnboardingSlice.name,
    discoverySlice.name,
    heliumStatusSlice.name,
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
