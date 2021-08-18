import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { OraclePrice } from '@helium/http'
import {
  getBlockHeight,
  getBlockStats,
  getCurrentOraclePrice,
  getPredictedOraclePrice,
  getStatCounts,
} from '../../utils/appDataClient'
import { getCurrentPrices } from '../../utils/coinGeckoClient'
import { getMakers, Maker } from '../../utils/stakingClient'

export type HeliumDataState = {
  blockHeight?: number
  currentOraclePrice?: OraclePrice
  predictedOraclePrices: OraclePrice[]
  currentPrices?: Record<string, number>
  makers?: Maker[]
  hotspotCount?: number
  blockTime?: number
}
const initialState: HeliumDataState = {
  predictedOraclePrices: [],
  blockTime: 0,
}

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

export const fetchStats = createAsyncThunk('heliumData/stats', async () =>
  Promise.all([getStatCounts(), getBlockStats()]),
)

export const fetchInitialData = createAsyncThunk<HeliumDataState>(
  'heliumData/fetchInitialData',
  async () => {
    const vals = await Promise.all([
      getCurrentOraclePrice(),
      getPredictedOraclePrice(),
      getCurrentPrices(),
      getMakers(),
    ])
    return {
      currentOraclePrice: vals[0],
      predictedOraclePrices: vals[1],
      currentPrices: vals[2],
      makers: vals[3],
    }
  },
)

// This slice contains global helium data not specifically related to the current user
const heliumDataSlice = createSlice({
  name: 'heliumData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchInitialData.fulfilled, (state, { payload }) => {
      state.currentOraclePrice = payload.currentOraclePrice
      state.predictedOraclePrices = payload.predictedOraclePrices
      state.currentPrices = payload.currentPrices
      state.makers = payload.makers
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
    builder.addCase(fetchStats.fulfilled, (state, { payload }) => {
      const [statCounts, blockStats] = payload
      state.hotspotCount = statCounts.hotspots
      state.blockTime = blockStats.lastDay.avg
    })
  },
})

export default heliumDataSlice
