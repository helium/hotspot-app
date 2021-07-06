import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Account } from '@helium/http'
import { getAccount } from '../../utils/appDataClient'
import { getWallet } from '../../utils/walletClient'
import { ChartData, ChartRange } from '../../components/BarChart/types'
import { FilterType } from '../../features/wallet/root/walletTypes'
import { Loading } from '../activity/activitySlice'

export type ChartRangeData = { data: ChartData[]; loading: Loading }
type ActivityChart = Record<ChartRange, ChartRangeData>

export type AccountState = {
  account?: Account
  fetchDataStatus: Loading
  activityChart: Record<FilterType, ActivityChart>
  activityChartRange: ChartRange
}

const initialState: AccountState = {
  fetchDataStatus: 'idle',
  activityChart: {} as Record<FilterType, ActivityChart>,
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
      const currentChart =
        state.activityChart[meta.arg.filterType]?.[meta.arg.range] || {}

      if (!state.activityChart[meta.arg.filterType]) {
        state.activityChart[meta.arg.filterType] = {} as ActivityChart
      }

      if (!state.activityChart[meta.arg.filterType][meta.arg.range]) {
        state.activityChart[meta.arg.filterType][meta.arg.range] = {
          ...currentChart,
          data: [] as ChartData[],
        }
      }

      state.activityChart[meta.arg.filterType][meta.arg.range].loading =
        'pending'
    })
    builder.addCase(
      fetchActivityChart.fulfilled,
      (state, { meta, payload }) => {
        const currentChart =
          state.activityChart[meta.arg.filterType]?.[meta.arg.range] || {}

        state.activityChart[meta.arg.filterType][meta.arg.range] = {
          ...currentChart,
          data: payload,
          loading: 'fulfilled',
        }
      },
    )
    builder.addCase(fetchActivityChart.rejected, (state, { meta }) => {
      const currentChart =
        state.activityChart[meta.arg.filterType]?.[meta.arg.range] || {}

      state.activityChart[meta.arg.filterType][meta.arg.range] = {
        ...currentChart,
        loading: 'rejected',
      }
    })
  },
})

export default accountSlice
