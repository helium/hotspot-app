import React, { memo, useEffect, useRef, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { AnyTransaction, PendingTransaction, PaymentV1 } from '@helium/http'
import WalletView from './WalletView'
import Box from '../../../components/Box'
import ActivityDetails from './ActivityDetails/ActivityDetails'
import useVisible from '../../../utils/useVisible'
import usePrevious from '../../../utils/usePrevious'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import { fetchTxns } from '../../../store/activity/activitySlice'
import animateTransition from '../../../utils/animateTransition'

const WalletScreen = () => {
  const dispatch = useAppDispatch()
  const [transactionData, setTransactionData] = useState<AnyTransaction[]>([])
  const [pendingTxns, setPendingTxns] = useState<PendingTransaction[]>([])
  const [hasActivity, setHasActivity] = useState<boolean | undefined>()
  const {
    activity: { txns, filter, detailTxn, requestMore },
    heliumData: { blockHeight },
  } = useSelector((state: RootState) => state)
  const interval = useRef<NodeJS.Timeout>()
  const visible = useVisible()
  const prevVisible = usePrevious(visible)
  const prevBlockHeight = usePrevious(blockHeight)
  const prevAllTxnsStatus = usePrevious(txns.all.status)

  const determineHasActivity = useCallback(() => {
    // TODO: Have this check all filters. Data may update when they're on a filter other than ALL

    if (hasActivity) {
      return
    }

    if (
      prevAllTxnsStatus === 'pending' &&
      (txns.all.status === 'fulfilled' || txns.all.status === 'rejected')
    ) {
      const nextHasActivity = txns.all.data.length > 0
      if (nextHasActivity !== hasActivity) {
        animateTransition()
        setHasActivity(nextHasActivity)
      }
    }
  }, [hasActivity, prevAllTxnsStatus, txns.all.data.length, txns.all.status])

  useEffect(() => {
    determineHasActivity()
  }, [determineHasActivity])

  const updateTxnData = (data: AnyTransaction[]) => {
    animateTransition()
    setTransactionData(data)
  }

  useEffect(() => {
    if (
      filter === 'pending' ||
      txns[filter].status === 'pending' ||
      txns[filter].status === 'idle'
    ) {
      return
    }
    const { data } = txns[filter]
    if (data.length !== transactionData.length) {
      updateTxnData(data)
    } else if (data.length) {
      data.every((txn, index) => {
        const prevTxn = txn as PaymentV1
        const nextTxn = transactionData[index] as PaymentV1

        const hashEqual = nextTxn.hash === prevTxn.hash
        if (!hashEqual) {
          // data has changed update
          updateTxnData(data)
        }
        return hashEqual
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txns[filter]])

  useEffect(() => {
    if (!txns.pending.data.length && !pendingTxns.length) return

    setPendingTxns(txns.pending.data)
  }, [pendingTxns, txns.pending.data])

  useEffect(() => {
    // Fetch pending txns on an interval of 5s
    if (!visible && interval.current) {
      clearInterval(interval.current)
      interval.current = undefined
    } else if (visible && !interval.current) {
      dispatch(fetchTxns({ filter: 'pending' }))

      interval.current = setInterval(() => {
        if (txns.pending.status === 'pending') return

        dispatch(fetchTxns({ filter: 'pending' }))
      }, 5000)
    }
  }, [dispatch, txns.pending.status, visible])

  useEffect(() => {
    // if we're resetting wait for it to finish
    // if the filter is set to pending, do nothing. It refreshes on an interval.
    if (!visible || filter === 'pending') return

    // Block height is being request every 30s in App.tsx
    // Reset data if block changes or view becomes visible
    if (!prevVisible || blockHeight !== prevBlockHeight) {
      dispatch(fetchTxns({ filter, reset: true }))
      return
    }

    // if filter changes & there's no txn data for that filter, request
    if (txns[filter].data.length === 0 && txns[filter].status === 'idle') {
      dispatch(fetchTxns({ filter }))
    }
  }, [
    visible,
    prevVisible,
    blockHeight,
    prevBlockHeight,
    filter,
    txns,
    dispatch,
  ])

  useEffect(() => {
    if (!visible) return
    if (requestMore && txns[filter].status !== 'pending') {
      dispatch(fetchTxns({ filter }))
    }
  }, [dispatch, filter, requestMore, txns, visible])

  return (
    <>
      <Box flex={1} backgroundColor="primaryBackground">
        <WalletView
          status={txns[filter].status}
          hasActivity={hasActivity}
          txns={transactionData}
          pendingTxns={pendingTxns}
          filter={filter}
        />
      </Box>

      <ActivityDetails detailTxn={detailTxn} />
    </>
  )
}

export default memo(WalletScreen)
