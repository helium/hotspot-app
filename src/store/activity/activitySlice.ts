import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { differenceBy, unionBy, uniqBy } from 'lodash'
import {
  Filters,
  FilterType,
  TxnType,
} from '../../features/wallet/root/walletTypes'
import { getWallet } from '../../utils/walletClient'

export type HttpReward = {
  account: string
  amount: number
  gateway: string
  type: string
}

export type HttpPayment = {
  payee: string
  amount: number
  memo?: string | null
}

export type HttpTransaction = {
  time: number
  memo?: string | null
  type: TxnType
  hash: string
  endEpoch?: number | null
  startEpoch?: number | null
  height?: number
  seller?: string | null
  amountToSeller?: number | null
  rewards?: HttpReward[] | null
  payer?: string | null
  payee?: string | null
  nonce?: number | null
  fee?: number | null
  amount?: number | null
  stakingFee?: number | null
  stake?: number | null
  stakeAmount?: number | null
  payments?: HttpPayment[] | null
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
  data: HttpTransaction[]
}

export type HttpPendingTransaction = {
  created_at: string
  failed_reason: string
  hash: string
  status: string
  txn: HttpTransaction
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
    all: Activity<HttpTransaction>
    hotspot: Activity<HttpTransaction>
    mining: Activity<HttpTransaction>
    payment: Activity<HttpTransaction>
    burn: Activity<HttpTransaction>
    validator: Activity<HttpTransaction>
    pending: Activity<HttpPendingTransaction>
  }
  filter: FilterType
  detailTxn?: HttpTransaction | HttpPendingTransaction
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

export const fetchMoreTxns = createAsyncThunk<
  AccountTransactions,
  { filter: Exclude<FilterType, 'pending'> }
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
  AccountTransactions | HttpPendingTransaction[],
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
    addPendingTransaction: (
      state,
      action: PayloadAction<HttpPendingTransaction>,
    ) => {
      state.txns.pending.data.push(action.payload)
    },
    setDetailTxn: (
      state,
      action: PayloadAction<HttpTransaction | HttpPendingTransaction>,
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
        state.txns.pending.data = differenceBy(
          state.txns.pending.data,
          nextTxns,
          'hash',
        )
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
          const pending = payload as HttpPendingTransaction[]
          const existingPending = state.txns.pending.data
          const newPending = unionBy(pending, existingPending, 'hash')
          state.txns.pending.data = newPending.filter(
            (txn) => txn.status === 'pending',
          )
        } else {
          const txns = payload as AccountTransactions
          state.txns[filter].cursor = txns.cursor

          const nextTxns = txns.data.sort((a, b) => b.time - a.time)
          state.txns[filter].data = nextTxns

          // remove any pending txns with the same hash
          state.txns.pending.data = differenceBy(
            state.txns.pending.data,
            nextTxns,
            'hash',
          )
        }
      },
    )
  },
})

export default activitySlice
