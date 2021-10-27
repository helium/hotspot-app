import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { differenceBy, unionBy } from 'lodash'
import { Filters, FilterType } from '../../features/wallet/root/walletTypes'
import { getWallet } from '../../utils/walletClient'

export const TxnTypeKeys = [
  'rewards_v1',
  'rewards_v2',
  'payment_v1',
  'payment_v2',
  'add_gateway_v1',
  'assert_location_v1',
  'assert_location_v2',
  'transfer_hotspot_v1',
  'token_burn_v1',
  'unstake_validator_v1',
  'stake_validator_v1',
  'transfer_validator_stake_v1',
] as const
export type TxnType = typeof TxnTypeKeys[number]

export type Reward = {
  account: string
  amount: number
  gateway: string
  type: string
}

export type Payment = {
  payee: string
  amount: number
  memo?: string | null
}

export type Transaction = {
  time: number
  memo?: string | null
  type: TxnType
  hash: string
  endEpoch?: number | null
  startEpoch?: number | null
  height?: number
  seller?: string | null
  amountToSeller?: number | null
  rewards?: Reward[] | null
  payer?: string | null
  payee?: string | null
  nonce?: number | null
  fee?: number | null
  amount?: number | null
  stakingFee?: number | null
  stake?: number | null
  stakeAmount?: number | null
  payments?: Payment[] | null
  gateway?: string | null
  address?: string | null
  oldAddress?: string | null
  newAddress?: string | null
  oldOwner?: string | null
  newOwner?: string | null
  lat?: number | null
  lng?: number | null
  gain?: number | null
  elevation?: number | null
  location?: string | null
  owner?: string | null
  buyer?: string | null
}

export type AccountTransactions = {
  cursor: string | null
  data: Transaction[]
}

export type PendingTransaction = {
  created_at: string
  failed_reason: string
  hash: string
  status: string
  txn: Transaction
  type: TxnType
  updated_at: string
}

export type Loading = 'idle' | 'pending' | 'fulfilled' | 'rejected'

export type ActivityState = {
  txns: {
    all: {
      cursor: string | null
      data: Transaction[]
      status: Loading
      hasInitialLoad: boolean
    }
    hotspot: {
      cursor: string | null
      data: Transaction[]
      status: Loading
      hasInitialLoad: boolean
    }
    mining: {
      cursor: string | null
      data: Transaction[]
      status: Loading
      hasInitialLoad: boolean
    }
    payment: {
      cursor: string | null
      data: Transaction[]
      status: Loading
      hasInitialLoad: boolean
    }
    pending: {
      cursor: string | null
      data: PendingTransaction[]
      status: Loading
      hasInitialLoad: boolean
    }
  }
  filter: FilterType
  detailTxn?: Transaction | PendingTransaction
  requestMore: boolean
}

const initialState: ActivityState = {
  txns: {
    all: {
      data: [],
      cursor: null,
      status: 'idle',
      hasInitialLoad: false,
    },
    hotspot: { data: [], cursor: null, status: 'idle', hasInitialLoad: false },
    mining: { data: [], cursor: null, status: 'idle', hasInitialLoad: false },
    payment: { data: [], cursor: null, status: 'idle', hasInitialLoad: false },
    pending: { data: [], cursor: null, status: 'idle', hasInitialLoad: false },
  },
  filter: 'all',
  requestMore: false,
}

export const ACTIVITY_FETCH_SIZE = 15

type FetchTxns = { filter: FilterType; reset?: boolean }
export const fetchTxns = createAsyncThunk<
  AccountTransactions | PendingTransaction[],
  FetchTxns
>(
  'activity/fetchAccountActivity',
  async ({ filter, reset }, { dispatch, getState }) => {
    let { cursor } = (getState() as {
      activity: ActivityState
    }).activity.txns[filter]
    if (reset) {
      dispatch(activitySlice.actions.resetTxns(filter))
      cursor = null
    }

    if (filter === 'pending') {
      return getWallet('accounts/activity/pending', null, { camelCase: true })
    }
    let params = {}
    if (cursor) {
      params = { cursor }
    }
    if (filter) {
      params = { ...params, filter: Filters[filter].join(',') }
    }

    return getWallet('accounts/activity', params, {
      camelCase: true,
      showCursor: true,
    })
  },
)

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload
    },
    requestMoreActivity: (state) => {
      state.requestMore = true
    },
    resetTxns: (state, action: PayloadAction<FilterType>) => {
      Object.keys(state.txns).forEach((key) => {
        const filterType = key as FilterType
        if (filterType !== 'pending' && filterType !== action.payload) {
          // Don't reset pending, it updates on an interval, and we clear it manually
          // Don't reset the requested filter type. We want that one to stay pending
          state.txns[filterType].status = 'idle'
          state.txns[filterType].cursor = null
          state.txns[filterType].data = []
        }
      })
    },
    addPendingTransaction: (
      state,
      action: PayloadAction<PendingTransaction>,
    ) => {
      state.txns.pending.data.push(action.payload)
    },
    setDetailTxn: (
      state,
      action: PayloadAction<Transaction | PendingTransaction>,
    ) => {
      state.detailTxn = action.payload
    },
    clearDetailTxn: (state) => {
      return { ...state, detailTxn: undefined }
    },
    signOut: () => {
      return { ...initialState }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchTxns.pending,
      (
        state,
        {
          meta: {
            arg: { filter },
          },
        },
      ) => {
        state.txns[filter].status = 'pending'
      },
    )
    builder.addCase(
      fetchTxns.rejected,
      (
        state,
        {
          meta: {
            arg: { filter },
          },
        },
      ) => {
        if (!state.txns[filter].hasInitialLoad) {
          state.txns[filter].hasInitialLoad = true
        }
        state.requestMore = false
        state.txns[filter].status = 'rejected'
      },
    )
    builder.addCase(
      fetchTxns.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { filter, reset },
          },
        },
      ) => {
        state.requestMore = false
        state.txns[filter].status = 'fulfilled'
        if (!state.txns[filter].hasInitialLoad) {
          state.txns[filter].hasInitialLoad = true
        }

        if (reset && state.filter === filter) {
          Object.keys(state.txns).forEach((key) => {
            const filterType = key as FilterType
            if (filterType !== 'pending') {
              // Don't reset pending, we will clear it manually
              state.txns[filterType].data = []
            }
          })
        }

        if (filter === 'pending') {
          const pending = payload as PendingTransaction[]
          // if (pending.length === 0) return // TODO: Is this needed?
          const filtered = pending.filter((txn) => txn.status === 'pending')
          const joined = unionBy(filtered, state.txns.pending.data, 'hash')
          state.txns.pending.data = joined
        } else {
          const accountTransactions = payload as AccountTransactions
          // if (accountTransactions.data?.length === 0) return // TODO: Is this needed?
          const nextTxns = [
            ...state.txns[filter].data,
            ...accountTransactions.data,
          ]
          state.txns[filter].data = nextTxns
          state.txns[filter].cursor = accountTransactions.cursor

          // remove any pending txns with the same hash
          const nextPending = differenceBy(
            state.txns.pending.data,
            nextTxns,
            'hash',
          )
          state.txns.pending.data = nextPending
        }
      },
    )
  },
})

export default activitySlice
