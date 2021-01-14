import { configureStore, Action, getDefaultMiddleware } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'
import { useDispatch, useStore } from 'react-redux'
import rootReducer, { RootState } from './rootReducer'
import Reactotron from '../../ReactotronConfig'

const enhancers = []
if (Reactotron.createEnhancer) {
  enhancers.push(Reactotron.createEnhancer())
}

const store = configureStore({
  reducer: rootReducer,
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
