import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { PendingTransaction, AnyTransaction } from '@helium/http'
import { differenceBy, unionBy } from 'lodash'
import { initFetchers, txnFetchers } from '../../utils/appDataClient'
import { FilterType } from '../../features/wallet/root/walletTypes'

export type Loading = 'idle' | 'pending' | 'fulfilled' | 'rejected'

export type ActivityState = {
  txns: {
    all: { data: AnyTransaction[]; status: Loading }
    hotspot: { data: AnyTransaction[]; status: Loading }
    mining: { data: AnyTransaction[]; status: Loading }
    payment: { data: AnyTransaction[]; status: Loading }
    pending: { data: PendingTransaction[]; status: Loading }
  }
  filter: FilterType
  detailTxn?: AnyTransaction | PendingTransaction
  isResetting: boolean
  requestMore: boolean
}

const initialState: ActivityState = {
  txns: {
    all: { data: [], status: 'idle' },
    hotspot: { data: [], status: 'idle' },
    mining: { data: [], status: 'idle' },
    payment: { data: [], status: 'idle' },
    pending: { data: [], status: 'idle' },
  },
  filter: 'all',
  isResetting: false,
  requestMore: false,
}

export const fetchTxns = createAsyncThunk<
  AnyTransaction[] | PendingTransaction[],
  FilterType
>('activity/fetchAccountActivity', async (filter) => {
  const list = txnFetchers[filter]
  return list.takeJSON(filter === 'pending' ? 1000 : 50)
})

export const resetTxns = createAsyncThunk(
  'activity/resetTxns',
  async (_, { dispatch }) => {
    dispatch(activitySlice.actions.resetTxns())
    await initFetchers()
    dispatch(activitySlice.actions.finishReset())
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
    addPendingTransaction: (
      state,
      action: PayloadAction<PendingTransaction>,
    ) => {
      state.txns.pending.data.push(action.payload)
    },
    setDetailTxn: (
      state,
      action: PayloadAction<AnyTransaction | PendingTransaction>,
    ) => {
      state.detailTxn = action.payload
    },
    clearDetailTxn: (state) => {
      return { ...state, detailTxn: undefined }
    },
    resetTxns: (state) => {
      state.isResetting = true
      Object.keys(state.txns).forEach((key) => {
        const filterType = key as FilterType
        if (filterType !== 'pending') {
          // Don't reset pending, we will clear it manually
          state.txns[filterType].data = []
        }
      })
    },
    finishReset: (state) => {
      state.isResetting = false
    },
    signOut: () => {
      return { ...initialState }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTxns.pending, (state, { meta: { arg: filter } }) => {
      state.txns[filter].status = 'pending'
    })
    builder.addCase(fetchTxns.rejected, (state, { meta: { arg: filter } }) => {
      state.requestMore = false
      state.txns[filter].status = 'rejected'
    })
    builder.addCase(
      fetchTxns.fulfilled,
      (state, { payload, meta: { arg: filter } }) => {
        state.requestMore = false
        state.txns[filter].status = 'fulfilled'

        if (payload.length === 0) return

        if (filter === 'pending') {
          const pending = payload as PendingTransaction[]
          const filtered = pending.filter((txn) => txn.status === 'pending')
          const joined = unionBy(filtered, state.txns.pending.data, 'hash')
          state.txns.pending.data = joined
        } else {
          const newTxns = payload as AnyTransaction[]
          state.txns[filter].data = [...state.txns[filter].data, ...newTxns]
          // remove any pending txns with the same hash
          state.txns.pending.data = differenceBy(
            state.txns.pending.data,
            newTxns,
            'hash',
          )
        }
      },
    )
  },
})

export default activitySlice
