import React, { memo, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import useAppState from 'react-native-appstate-hook'
import ActivityDetails from './ActivityDetails/ActivityDetails'
import useVisible from '../../../utils/useVisible'
import usePrevious from '../../../utils/usePrevious'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import activitySlice, {
  fetchMoreTxns,
  fetchTxnsHead,
} from '../../../store/activity/activitySlice'
import animateTransition from '../../../utils/animateTransition'
import { ActivityViewState } from './walletTypes'
import SafeAreaBox from '../../../components/SafeAreaBox'
import WalletView from './WalletView'

const WalletScreen = () => {
  const dispatch = useAppDispatch()
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

  const { appState } = useAppState()
  const prevAppState = usePrevious(appState)

  useEffect(() => {
    // clear the list data when coming into foreground
    if (prevAppState && appState === 'active' && prevAppState !== 'active') {
      dispatch(activitySlice.actions.reset())
      dispatch(fetchTxnsHead({ filter: 'all' }))
      dispatch(fetchTxnsHead({ filter: 'pending' }))
    }
  }, [appState, dispatch, filter, prevAppState])

  useEffect(() => {
    const preloadData = () => {
      dispatch(fetchTxnsHead({ filter: 'all' }))
      dispatch(fetchTxnsHead({ filter: 'pending' }))
    }
    preloadData()
  }, [dispatch])

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
      activityViewState !== 'no_activity' &&
      txns[filter].status === 'fulfilled'
    ) {
      animateTransition('WalletScreen.NoActivity')
      setActivityViewState('no_activity')
    }
  }, [filter, activityViewState, txns, visible])

  useEffect(() => {
    const nextShowSkeleton =
      !txns[filter].hasInitialLoad || !txns.pending.hasInitialLoad

    if (nextShowSkeleton !== showSkeleton) {
      if (visible && activityViewState !== 'no_activity') {
        animateTransition('WalletScreen.ShowSkeleton', {
          enabledOnAndroid: false,
        })
      }
      setShowSkeleton(nextShowSkeleton)
    }
  }, [activityViewState, filter, showSkeleton, txns, visible])

  useEffect(() => {
    // Fetch pending txns on an interval of 5s
    if (!visible && interval.current) {
      clearInterval(interval.current)
      interval.current = undefined
    } else if (visible && !interval.current) {
      dispatch(fetchTxnsHead({ filter: 'pending' }))
      interval.current = setInterval(() => {
        dispatch(fetchTxnsHead({ filter: 'pending' }))
      }, 5000)
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
          activityViewState={activityViewState}
          showSkeleton={showSkeleton}
          txns={filter === 'pending' ? [] : txns[filter].data}
          pendingTxns={txns.pending.data}
        />
      </SafeAreaBox>
      {detailTxn && <ActivityDetails detailTxn={detailTxn} />}
    </>
  )
}

export default memo(WalletScreen)
