import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { AnyTransaction, PendingTransaction, PaymentV1 } from '@helium/http'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import WalletViewContainer from './WalletViewContainer'
import Box from '../../../components/Box'
import ActivityDetails from './ActivityDetails/ActivityDetails'
import useVisible from '../../../utils/useVisible'
import usePrevious from '../../../utils/usePrevious'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import { fetchTxns } from '../../../store/activity/activitySlice'
import animateTransition from '../../../utils/animateTransition'
import { ActivityViewState } from './walletTypes'

const WalletScreen = () => {
  const dispatch = useAppDispatch()
  const [transactionData, setTransactionData] = useState<AnyTransaction[]>([])
  const [pendingTxns, setPendingTxns] = useState<PendingTransaction[]>([])
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [activityViewState, setActivityViewState] = useState<ActivityViewState>(
    'undetermined',
  )

  const {
    activity: { txns, filter, detailTxn, requestMore },
    heliumData: { blockHeight },
  } = useSelector((state: RootState) => state)

  const interval = useRef<NodeJS.Timeout>()
  const visible = useVisible()
  const prevVisible = usePrevious(visible)
  const prevBlockHeight = usePrevious(blockHeight)

  const updateTxnData = useCallback((data: AnyTransaction[]) => {
    animateTransition()
    setTransactionData(data)
  }, [])

  useEffect(() => {
    const preloadData = () => {
      dispatch(fetchTxns({ filter: 'all', reset: true }))
      dispatch(fetchTxns({ filter: 'pending' }))
    }
    preloadData()
  }, [dispatch])

  useEffect(() => {
    if (filter === 'pending') {
      setTransactionData([])
      return
    }
    if (txns[filter].status === 'pending' || txns[filter].status === 'idle') {
      return
    }
    const { data } = txns[filter]
    if (data.length !== transactionData.length) {
      updateTxnData(data)
    } else if (data.length) {
      data.some((txn, index) => {
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

  useEffect(() => {}, [showSkeleton, activityViewState])

  useEffect(() => {
    if (!txns.pending.data.length && !pendingTxns.length) return

    setPendingTxns(txns.pending.data)
  }, [pendingTxns, txns.pending.data])

  useEffect(() => {
    // once you have activity, you always have activity
    if (activityViewState === 'activity') return

    const { hasInitialLoad: allLoaded, data: allData } = txns.all
    const { hasInitialLoad: pendingLoaded, data: pendingData } = txns.pending

    if (!allLoaded || !pendingLoaded) return

    if (pendingData.length || allData.length) {
      setActivityViewState('activity')
    } else if (
      !pendingData.length &&
      !allData.length &&
      activityViewState !== 'no_activity'
    ) {
      setActivityViewState('no_activity')
    }
  }, [filter, activityViewState, txns])

  useEffect(() => {
    const nextShowSkeleton =
      !txns[filter].hasInitialLoad || !txns.pending.hasInitialLoad

    if (nextShowSkeleton !== showSkeleton) {
      if (visible) {
        animateTransition()
      }
      setShowSkeleton(nextShowSkeleton)
    }
  }, [filter, showSkeleton, txns, visible])

  useEffect(() => {
    // Fetch pending txns on an interval of 5s
    if (!visible && interval.current) {
      clearInterval(interval.current)
      interval.current = undefined
    } else if (visible && !interval.current) {
      dispatch(fetchTxns({ filter: 'pending' }))

      interval.current = setInterval(() => {
        dispatch(fetchTxns({ filter: 'pending' }))
      }, 5000)
    }
  }, [dispatch, visible])

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
        <BottomSheetModalProvider>
          <WalletViewContainer
            txns={transactionData}
            pendingTxns={pendingTxns}
            filter={filter}
            activityViewState={activityViewState}
            showSkeleton={showSkeleton}
          />
        </BottomSheetModalProvider>
      </Box>

      {detailTxn && <ActivityDetails detailTxn={detailTxn} />}
    </>
  )
}

export default memo(WalletScreen)
