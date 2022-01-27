import React, { memo, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ActivityDetails from './ActivityDetails/ActivityDetails'
import useVisible from '../../../utils/useVisible'
import usePrevious from '../../../utils/usePrevious'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import {
  fetchMoreTxns,
  fetchTxnsHead,
} from '../../../store/activity/activitySlice'
import SafeAreaBox from '../../../components/SafeAreaBox'
import WalletView from './WalletView'

const WalletScreen = () => {
  const dispatch = useAppDispatch()
  const [showSkeleton, setShowSkeleton] = useState(true)

  const {
    activity: { txns, filter, detailTxn, requestMore },
    heliumData: { blockHeight },
  } = useSelector((state: RootState) => state)

  const interval = useRef<NodeJS.Timeout>()
  const visible = useVisible()
  const prevVisible = usePrevious(visible)
  const prevBlockHeight = usePrevious(blockHeight)

  useEffect(() => {
    const nextShowSkeleton = !txns[filter].hasInitialLoad

    if (nextShowSkeleton !== showSkeleton) {
      setShowSkeleton(nextShowSkeleton)
    }
  }, [filter, showSkeleton, txns, visible])

  useEffect(() => {
    // Fetch pending txns on an interval of 60s
    if (!visible && interval.current) {
      clearInterval(interval.current)
      interval.current = undefined
    } else if (visible && !interval.current) {
      dispatch(fetchTxnsHead({ filter: 'pending' }))
      interval.current = setInterval(() => {
        dispatch(fetchTxnsHead({ filter: 'pending' }))
      }, 60000)
    }
  }, [dispatch, visible])

  useEffect(() => {
    // if we're resetting wait for it to finish
    // if the filter is set to pending, do nothing. It refreshes on an interval.
    if (!visible || filter === 'pending') return

    // Block height is being request every 30s in App.tsx
    // Reset data if block changes or view becomes visible
    if (
      !prevVisible ||
      blockHeight !== prevBlockHeight ||
      txns[filter].status === 'idle'
    ) {
      dispatch(fetchTxnsHead({ filter }))
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
    if (
      requestMore &&
      filter !== 'pending' &&
      txns[filter].status !== 'pending' &&
      txns[filter].status !== 'more_rejected' &&
      txns[filter].cursor
    ) {
      dispatch(fetchMoreTxns({ filter }))
    }
  }, [dispatch, filter, requestMore, txns, visible])

  return (
    <>
      <SafeAreaBox flex={1} backgroundColor="primaryBackground">
        <WalletView
          showSkeleton={showSkeleton}
          txns={filter === 'pending' ? [] : txns[filter].data}
          loadingTxns={txns[filter].status === 'pending'}
          pendingTxns={txns.pending.data}
        />
      </SafeAreaBox>
      {detailTxn && <ActivityDetails detailTxn={detailTxn} />}
    </>
  )
}

export default memo(WalletScreen)
