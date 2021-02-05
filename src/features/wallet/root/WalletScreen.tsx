import React, { memo, useEffect, useRef, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { AnyTransaction, PendingTransaction } from '@helium/http'
import WalletView from './WalletView'
import Box from '../../../components/Box'
import ActivityDetails from './ActivityDetails/ActivityDetails'
import useVisible from '../../../utils/useVisible'
import usePrevious from '../../../utils/usePrevious'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import { fetchTxns, resetTxns } from '../../../store/activity/activitySlice'
import animateTransition from '../../../utils/animateTransition'

const WalletScreen = () => {
  const dispatch = useAppDispatch()
  const [transactionData, setTransactionData] = useState<AnyTransaction[]>([])
  const [pendingTxns, setPendingTxns] = useState<PendingTransaction[]>([])
  const [hasActivity, setHasActivity] = useState<boolean | undefined>()
  const {
    activity: { txns, requestMore, filter, isResetting, detailTxn },
    heliumData: { blockHeight },
  } = useSelector((state: RootState) => state)
  const interval = useRef<NodeJS.Timeout>()
  const visible = useVisible()
  const prevVisible = usePrevious(visible)
  const prevBlockHeight = usePrevious(blockHeight)
  const prevAllTxnsStatus = usePrevious(txns.all.status)

  const determineHasActivity = useCallback(() => {
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

  useEffect(() => {
    if (filter === 'pending') {
      return
    }
    const { data } = txns[filter]
    if (data.length !== transactionData.length) {
      setTransactionData(data)
    }
    animateTransition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txns[filter]])

  useEffect(() => {
    if (!txns.pending.data.length && !!pendingTxns.length) return

    setPendingTxns(pendingTxns)
  }, [pendingTxns, txns.pending.data.length])

  useEffect(() => {
    if (!visible && interval.current) {
      clearInterval(interval.current)
      interval.current = undefined
    } else if (visible && !interval.current) {
      interval.current = setInterval(() => {
        if (txns.pending.status === 'pending') return

        dispatch(fetchTxns('pending'))
      }, 30000)
    }
  }, [dispatch, txns.pending.status, visible])

  useEffect(() => {
    if (!visible || isResetting) return
    if (requestMore && txns[filter].status !== 'pending') {
      dispatch(fetchTxns(filter))
    }
  }, [dispatch, filter, isResetting, requestMore, txns, visible])

  useEffect(() => {
    if (!visible || isResetting) return

    if (!prevVisible || blockHeight !== prevBlockHeight) {
      dispatch(resetTxns())
    } else if (
      filter !== 'pending' &&
      txns[filter].data.length === 0 &&
      txns[filter].status !== 'pending'
    ) {
      dispatch(fetchTxns(filter))
    }
  }, [
    blockHeight,
    dispatch,
    filter,
    isResetting,
    prevBlockHeight,
    prevVisible,
    txns,
    visible,
  ])

  return (
    <>
      <Box flex={1} backgroundColor="primaryBackground">
        <WalletView
          status={txns[filter].status}
          hasActivity={hasActivity}
          txns={transactionData}
          pendingTxns={pendingTxns}
          isResetting={isResetting}
          filter={filter}
        />
      </Box>

      <ActivityDetails detailTxn={detailTxn} />
    </>
  )
}

export default memo(WalletScreen)
