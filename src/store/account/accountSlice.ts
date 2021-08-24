import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Account, Sum } from '@helium/http'
import { getAccount, getAccountRewards } from '../../utils/appDataClient'
import { getWallet, postWallet } from '../../utils/walletClient'
import { ChartData, ChartRange } from '../../components/BarChart/types'
import { FilterType } from '../../features/wallet/root/walletTypes'
import { Loading } from '../activity/activitySlice'
import {
  CacheRecord,
  handleCacheFulfilled,
  handleCacheRejected,
  hasValidCache,
} from '../../utils/cacheUtils'
import { getSecureItem } from '../../utils/secureAccount'

export type ChartRangeData = { data: ChartData[]; loading: Loading }
type ActivityChart = Record<ChartRange, ChartRangeData>

const boolKeys = [
  'isFleetModeEnabled',
  'hasFleetModeAutoEnabled',
  'convertHntToCurrency',
] as const
type BooleanKey = typeof boolKeys[number]
// Eventually we can add more types, but for now all our app account settings are booleans

export type AccountState = {
  account?: Account
  fetchDataStatus: Loading
  activityChart: Record<FilterType, ActivityChart>
  activityChartRange: ChartRange
  rewardsSum: CacheRecord<Sum>
  settings: {
    isFleetModeEnabled?: boolean
    hasFleetModeAutoEnabled?: boolean
    convertHntToCurrency?: boolean
  }
  settingsLoaded?: boolean
  settingsTransferRequired?: boolean
}

const initialState: AccountState = {
  fetchDataStatus: 'idle',
  activityChart: {} as Record<FilterType, ActivityChart>,
  activityChartRange: 'daily',
  rewardsSum: { loading: true } as CacheRecord<Sum>,
  settings: {},
}

type AccountData = {
  account?: Account
}

type SettingsBag = Array<{ key: string; value: string }>

const settingsBagToKeyValue = (payload: SettingsBag) =>
  payload.reduce((obj, { value, key }) => {
    let val: string | boolean | number | undefined
    if (boolKeys.includes(key as BooleanKey)) {
      val = value === 'true'
    } else {
      return obj
    }
    return { ...obj, [key]: val }
  }, {})

export const fetchAccountSettings = createAsyncThunk<SettingsBag>(
  'account/fetchAccountSettings',
  async () => getWallet('accounts/settings'),
)

export const transferAppSettingsToAccount = createAsyncThunk<SettingsBag>(
  'account/transferAppSettingsToAccount ',
  async () => {
    const fleetEnabled = await getSecureItem('fleetModeEnabled')
    const fleetAutoEnabled = await getSecureItem('hasFleetModeAutoEnabled')
    const convertHnt = await getSecureItem('convertHntToCurrency')
    const settings = [
      {
        key: 'isFleetModeEnabled',
        value: String(fleetEnabled),
      },
      {
        key: 'hasFleetModeAutoEnabled',
        value: String(fleetAutoEnabled),
      },
      {
        key: 'convertHntToCurrency',
        value: String(convertHnt),
      },
    ]
    return postWallet('accounts/settings', { settings })
  },
)

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

export const fetchAccountRewards = createAsyncThunk(
  'account/fetchAccountRewards',
  async (_, { getState }) => {
    const currentState = getState() as {
      account: {
        rewardsSum: CacheRecord<Sum>
      }
    }
    const sum = currentState.account.rewardsSum
    if (hasValidCache(sum)) {
      return sum
    }
    return getAccountRewards()
  },
)

export const updateFleetModeEnabled = createAsyncThunk<
  SettingsBag,
  { enabled: boolean; autoEnabled?: boolean }
>('account/updateFleetModeEnabled', async ({ enabled, autoEnabled }) => {
  const settings = [
    {
      key: 'isFleetModeEnabled',
      value: String(enabled),
    },
  ]
  if (autoEnabled) {
    settings.push({
      key: 'hasFleetModeAutoEnabled',
      value: String(autoEnabled),
    })
  }
  return postWallet('accounts/settings', { settings })
})

export const updateSetting = createAsyncThunk<
  SettingsBag,
  { key: BooleanKey; value: boolean }
>('account/updateSetting', async ({ key, value }) => {
  const setting = {
    key,
    value: String(value),
  }
  return postWallet('accounts/settings', setting)
})

// This slice contains data related to the user account
const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    signOut: () => {
      return { ...initialState }
    },
    updateSettingsTransferRequired: (state, action: PayloadAction<boolean>) => {
      state.settingsTransferRequired = action.payload
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
    builder.addCase(fetchAccountRewards.rejected, (state) => {
      state.rewardsSum = handleCacheRejected()
    })
    builder.addCase(fetchAccountRewards.fulfilled, (state, { payload }) => {
      state.rewardsSum = handleCacheFulfilled(payload)
    })
    builder.addCase(fetchAccountSettings.fulfilled, (state, { payload }) => {
      const settings = settingsBagToKeyValue(payload)
      const nextState = { ...state, settings, settingsLoaded: true }
      return nextState
    })
    builder.addCase(
      transferAppSettingsToAccount.fulfilled,
      (state, { payload }) => {
        const settings = settingsBagToKeyValue(payload)
        return {
          ...state,
          settings,
          settingsLoaded: true,
          settingsTransferRequired: false,
        }
      },
    )
    builder.addCase(
      updateFleetModeEnabled.pending,
      (
        state,
        {
          meta: {
            arg: { enabled, autoEnabled },
          },
        },
      ) => {
        state.settings.isFleetModeEnabled = enabled
        if (autoEnabled) {
          state.settings.hasFleetModeAutoEnabled = true
        }
      },
    )
    builder.addCase(
      updateSetting.pending,
      (
        state,
        {
          meta: {
            arg: { key, value },
          },
        },
      ) => {
        state.settings[key] = value
      },
    )
  },
})

export default accountSlice
