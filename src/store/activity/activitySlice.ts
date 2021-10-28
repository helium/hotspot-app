import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { differenceBy, unionBy, uniqBy } from 'lodash'
import {
  FilterPagingType,
  Filters,
  FilterType,
} from '../../features/wallet/root/walletTypes'
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

export type Loading =
  | 'idle'
  | 'pending'
  | 'fulfilled'
  | 'rejected'
  | 'more_rejected'

export type Activity<T> = {
  cursor?: string | null
  data: T[]
  status: Loading
  hasInitialLoad: boolean
}
export type ActivityState = {
  txns: {
    all: Activity<Transaction>
    hotspot: Activity<Transaction>
    mining: Activity<Transaction>
    payment: Activity<Transaction>
    burn: Activity<Transaction>
    validator: Activity<Transaction>
    pending: Activity<PendingTransaction>
  }
  filter: FilterType
  detailTxn?: Transaction | PendingTransaction
  requestMore: boolean
}

const initialState: ActivityState = {
  txns: {
    all: {
      data: [],
      status: 'idle',
      hasInitialLoad: false,
    },
    hotspot: {
      data: [],
      status: 'idle',
      hasInitialLoad: false,
    },
    burn: {
      data: [],
      status: 'idle',
      hasInitialLoad: false,
    },
    validator: {
      data: [],
      status: 'idle',
      hasInitialLoad: false,
    },
    mining: {
      data: [],
      status: 'idle',
      hasInitialLoad: false,
    },
    payment: {
      data: [],
      status: 'idle',
      hasInitialLoad: false,
    },
    pending: {
      data: [],
      status: 'idle',
      hasInitialLoad: false,
    },
  },
  filter: 'all',
  requestMore: false,
}

export const ACTIVITY_FETCH_SIZE = 15

export const fetchMoreTxns = createAsyncThunk<
  AccountTransactions,
  { filter: FilterPagingType }
>('activity/fetchMoreTxns', async ({ filter }, { getState }) => {
  const { cursor } = (getState() as {
    activity: ActivityState
  }).activity.txns[filter]

  if (!cursor) {
    throw new Error(`Cannot fetch more for filter ${filter} - no cursor`)
  }

  const params = { cursor, filter: Filters[filter].join(',') }

  return getWallet('accounts/activity', params, {
    camelCase: true,
    showCursor: true,
  })
})

export const fetchTxnsHead = createAsyncThunk<
  AccountTransactions | PendingTransaction[],
  { filter: FilterType }
>('activity/fetchTxnsHead', async ({ filter }) => {
  const params = { filter: Filters[filter].join(',') }

  if (filter === 'pending') {
    return getWallet('accounts/activity/pending', null, { camelCase: true })
  }
  return getWallet('accounts/activity', params, {
    camelCase: true,
    showCursor: true,
  })
})

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
    reset: () => {
      return { ...initialState }
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
      fetchMoreTxns.pending,
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
      fetchMoreTxns.rejected,
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
        state.txns[filter].status = 'more_rejected'
        console.error(`Request to fetchMoreTxns with ${filter} was rejected`)
      },
    )
    builder.addCase(
      fetchMoreTxns.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { filter },
          },
        },
      ) => {
        state.requestMore = false
        state.txns[filter].status = 'fulfilled'
        state.txns[filter].hasInitialLoad = true

        const nextTxns = uniqBy(
          [...state.txns[filter].data, ...payload.data],
          (t) => t.hash,
        ).sort((a, b) => b.time - a.time)
        state.txns[filter].data = nextTxns
        state.txns[filter].cursor = payload.cursor

        // remove any pending txns with the same hash
        const nextPending = differenceBy(
          state.txns.pending.data,
          nextTxns,
          'hash',
        )
        state.txns.pending.data = nextPending
      },
    )

    builder.addCase(
      fetchTxnsHead.pending,
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
      fetchTxnsHead.rejected,
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
        state.txns[filter].status = 'rejected'
        console.error(`Request to fetchTxnsHead with ${filter} was rejected`)
      },
    )
    builder.addCase(
      fetchTxnsHead.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { filter },
          },
        },
      ) => {
        state.txns[filter].status = 'fulfilled'
        state.txns[filter].hasInitialLoad = true

        if (filter === 'pending') {
          const pending = payload as PendingTransaction[]
          const filtered = pending.filter((txn) => txn.status === 'pending')
          const joined = unionBy(filtered, state.txns.pending.data, 'hash')
          state.txns.pending.data = joined
        } else {
          const txns = payload as AccountTransactions
          if (state.txns[filter].cursor === undefined) {
            state.txns[filter].cursor = txns.cursor
          }

          const nextTxns = uniqBy(
            [...txns.data, ...state.txns[filter].data],
            (t) => t.hash,
          ).sort((a, b) => b.time - a.time)
          state.txns[filter].data = nextTxns

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
