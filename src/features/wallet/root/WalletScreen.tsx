import React, { memo, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import WalletView from './WalletView'
import Box from '../../../components/Box'
import ActivityDetails from './ActivityDetails/ActivityDetails'
import useVisible from '../../../utils/useVisible'
import usePrevious from '../../../utils/usePrevious'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import { fetchTxns, resetTxns } from '../../../store/activity/activitySlice'

const WalletScreen = () => {
  const dispatch = useAppDispatch()
  const {
    activity: { requestMore, filter, isResetting },
    heliumData: { blockHeight },
  } = useSelector((state: RootState) => state)
  const interval = useRef<NodeJS.Timeout>()
  const visible = useVisible()
  const prevVisible = usePrevious(visible)
  const prevBlockHeight = usePrevious(blockHeight)

  useEffect(() => {
    if (!visible && interval.current) {
      clearInterval(interval.current)
      interval.current = undefined
    } else if (visible && !interval.current) {
      interval.current = setInterval(() => {
        dispatch(fetchTxns('pending'))
      }, 5000)
    }
  }, [dispatch, visible])

  useEffect(() => {
    if (!visible || isResetting) return
    if (requestMore) {
      dispatch(fetchTxns(filter))
    }
  }, [dispatch, filter, isResetting, requestMore, visible])

  useEffect(() => {
    if (!visible || isResetting) return

    if (!prevVisible || blockHeight !== prevBlockHeight) {
      dispatch(resetTxns())
    } else {
      dispatch(fetchTxns(filter))
    }
  }, [
    blockHeight,
    dispatch,
    filter,
    prevBlockHeight,
    prevVisible,
    visible,
    isResetting,
  ])

  return (
    <>
      <Box flex={1} backgroundColor="primaryBackground">
        <WalletView />
      </Box>

      <ActivityDetails />
    </>
  )
}

export default memo(WalletScreen)
