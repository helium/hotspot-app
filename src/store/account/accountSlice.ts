import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Account } from '@helium/http'
import { getAccount } from '../../utils/appDataClient'
import { getWallet } from '../../utils/walletClient'
import { ChartData, ChartRange } from '../../components/BarChart/types'
import { FilterType } from '../../features/wallet/root/walletTypes'
import { Loading } from '../activity/activitySlice'

type ChartRangeData = { data: ChartData[]; loading: Loading }
type ActivityChart = {
  daily: ChartRangeData
  weekly: ChartRangeData
  monthly: ChartRangeData
}

export type AccountState = {
  account?: Account
  fetchDataStatus: Loading
  activityChart: ActivityChart
  activityChartRange: ChartRange
}

const initialState: AccountState = {
  fetchDataStatus: 'idle',
  activityChart: {
    daily: { data: [], loading: 'idle' },
    weekly: { data: [], loading: 'idle' },
    monthly: { data: [], loading: 'idle' },
  },
  activityChartRange: 'daily',
}

type AccountData = {
  account?: Account
}

export const fetchData = createAsyncThunk<AccountData>(
  'account/fetchData',
  async () => {
    const data = await getAccount()
    return {
      account: data,
    }
  },
)

type ActivityChartParams = { range: ChartRange; filterType: FilterType }
export const fetchActivityChart = createAsyncThunk<
  ChartData[],
  ActivityChartParams
>('account/fetchActivityChart', async ({ range, filterType }) => {
  return getWallet('wallet/chart', { range, type: filterType })
})

// This slice contains data related to the user account
const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    signOut: () => {
      return { ...initialState }
    },
    resetActivityChart: (state) => {
      return { ...state, activityChart: initialState.activityChart }
    },
    setActivityChartRange: (state, action: PayloadAction<ChartRange>) => {
      return { ...state, activityChartRange: action.payload }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, _action) => {
      state.fetchDataStatus = 'pending'
    })
    builder.addCase(fetchData.fulfilled, (state, { payload }) => {
      state.fetchDataStatus = 'fulfilled'
      state.account = payload.account
    })
    builder.addCase(fetchData.rejected, (state, _action) => {
      state.fetchDataStatus = 'rejected'
    })
    builder.addCase(fetchActivityChart.pending, (state, { meta }) => {
      state.activityChart[meta.arg.range].loading = 'pending'
    })
    builder.addCase(
      fetchActivityChart.fulfilled,
      (state, { meta, payload }) => {
        state.activityChart[meta.arg.range].loading = 'fulfilled'
        state.activityChart[meta.arg.range].data = payload
      },
    )
    builder.addCase(fetchActivityChart.rejected, (state, { meta }) => {
      state.activityChart[meta.arg.range].loading = 'rejected'
    })
  },
})

export default accountSlice
