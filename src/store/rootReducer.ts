import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
import statsSlice from './stats/statsSlice'
import userSlice from './user/userSlice'

const userPersistConfig = {
  key: 'user',
  storage: AsyncStorage,
}

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userSlice.reducer),
  stats: statsSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
