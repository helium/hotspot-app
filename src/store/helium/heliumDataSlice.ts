import Balance, { USDollars } from '@helium/currency'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getBlockHeight,
  getCurrentOraclePrice,
  getPredictedOraclePrice,
} from '../../utils/appDataClient'
import { signOut } from '../../utils/secureAccount'

type OraclePrice = {
  price: Balance<USDollars>
  height?: number
  time?: number
}

export type HeliumDataState = {
  blockHeight?: number
  currentOraclePrice?: OraclePrice
  predictedOraclePrices: OraclePrice[]
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
    builder.addCase(fetchBlockHeight.fulfilled, (state, { payload }) => {
      state.blockHeight = payload
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
