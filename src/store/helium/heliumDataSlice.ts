import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { OraclePrice } from '@helium/http'
import {
  getBlockHeight,
  getCurrentOraclePrice,
  getPredictedOraclePrice,
} from '../../utils/appDataClient'
import { getCurrentPrices } from '../../utils/coinGeckoClient'
import { signOut } from '../../utils/secureAccount'

export type HeliumDataState = {
  blockHeight?: number
  currentOraclePrice?: OraclePrice
  predictedOraclePrices: OraclePrice[]
  currentPrices?: Record<string, number>
}
const initialState: HeliumDataState = { predictedOraclePrices: [] }

export const fetchBlockHeight = createAsyncThunk<number>(
  'heliumData/blockHeight',
  async () => getBlockHeight(),
)

export const fetchCurrentOraclePrice = createAsyncThunk<OraclePrice>(
  'heliumData/currentOraclePrice',
  async () => getCurrentOraclePrice(),
)

export const fetchPredictedOraclePrice = createAsyncThunk<OraclePrice[]>(
  'heliumData/predictedOraclePrice',
  async () => getPredictedOraclePrice(),
)

export const fetchInitialData = createAsyncThunk<HeliumDataState>(
  'heliumData/fetchInitialData',
  async () => {
    const vals = await Promise.all([
      getBlockHeight(),
      getCurrentOraclePrice(),
      getPredictedOraclePrice(),
      getCurrentPrices(),
    ])
    return {
      blockHeight: vals[0],
      currentOraclePrice: vals[1],
      predictedOraclePrices: vals[2],
      currentPrices: vals[3],
    }
  },
)

// This slice contains global helium data not specifically related to the current user
const heliumDataSlice = createSlice({
  name: 'heliumData',
  initialState,
  reducers: {
    signOut: () => {
      signOut()
      return { ...initialState, isRestored: true }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInitialData.fulfilled, (state, { payload }) => {
      state.currentOraclePrice = payload.currentOraclePrice
      state.predictedOraclePrices = payload.predictedOraclePrices
      state.blockHeight = payload.blockHeight
      state.currentPrices = payload.currentPrices
    })
    builder.addCase(fetchBlockHeight.fulfilled, (state, { payload }) => {
      // this is happening on an interval, only update if there's a change
      if (state.blockHeight !== payload) {
        state.blockHeight = payload
      }
    })
    builder.addCase(fetchCurrentOraclePrice.fulfilled, (state, { payload }) => {
      state.currentOraclePrice = payload
    })
    builder.addCase(
      fetchPredictedOraclePrice.fulfilled,
      (state, { payload }) => {
        state.predictedOraclePrices = payload
      },
    )
  },
})

export default heliumDataSlice
