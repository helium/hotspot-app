import { Hotspot } from '@helium/http'
import { getUnixTime } from 'date-fns'
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useAsync } from 'react-async-hook'
import { useSelector } from 'react-redux'
import animalName from 'angry-purple-tiger'
import discoverySlice, {
  fetchDiscoveryById,
  fetchRecentDiscoveries,
  startDiscovery,
} from '../../../../store/discovery/discoverySlice'
import {
  DiscoveryRequest,
  DISCOVERY_DURATION_MINUTES,
} from '../../../../store/discovery/discoveryTypes'
import { RootState } from '../../../../store/rootReducer'
import { useAppDispatch } from '../../../../store/store'
import animateTransition from '../../../../utils/animateTransition'
import { getSecureItem } from '../../../../utils/secureAccount'
import { useHotspotSettingsContext } from '../HotspotSettingsProvider'
import DiscoveryModeBegin from './DiscoveryModeBegin'
import DiscoveryModeResults from './DiscoveryModeResults'

type State = 'begin' | 'results'

type Props = { onClose: () => void; hotspot: Hotspot }
const DiscoveryModeRoot = ({ onClose, hotspot }: Props) => {
  const [viewState, setViewState] = useState<State>('begin')
  const [time, setTime] = useState(0)
  const { enableBack } = useHotspotSettingsContext()
  const { result: userAddress } = useAsync(getSecureItem, ['address'])
  const dispatch = useAppDispatch()
  const requestInterval = useRef<NodeJS.Timeout>()
  const clockInterval = useRef<NodeJS.Timeout>()
  const recentDiscoveryInfo = useSelector(
    (state: RootState) => state.discovery.recentDiscoveryInfo,
  )
  const infoLoading = useSelector(
    (state: RootState) => state.discovery.infoLoading,
  )
  const selectedRequest = useSelector(
    (state: RootState) => state.discovery.selectedRequest,
  )
  const requestId = useSelector((state: RootState) => state.discovery.requestId)

  const fetchRecent = useCallback(() => {
    if (!hotspot.address || !userAddress) return

    dispatch(fetchRecentDiscoveries({ hotspotAddress: hotspot.address }))
  }, [dispatch, hotspot.address, userAddress])

  useEffect(() => {
    if (viewState === 'begin') {
      fetchRecent()
    }
  }, [fetchRecent, viewState])

  const requestSeconds = useMemo(() => {
    const insertDate = selectedRequest
      ? new Date(selectedRequest.insertedAt)
      : null
    if (!insertDate) return 0

    return getUnixTime(insertDate)
  }, [selectedRequest])

  const shouldPoll = useMemo(() => {
    if (viewState === 'begin') return false

    if (!selectedRequest) {
      return true
    }
    return time - requestSeconds < DISCOVERY_DURATION_MINUTES * 60
  }, [requestSeconds, selectedRequest, time, viewState])

  useEffect(() => {
    if (clockInterval.current) {
      clearInterval(clockInterval.current)
      clockInterval.current = undefined
    }

    if (!recentDiscoveryInfo?.serverDate || !shouldPoll) return

    const serverTime = getUnixTime(new Date(recentDiscoveryInfo?.serverDate))
    setTime(serverTime)
    clockInterval.current = setInterval(() => {
      setTime((val) => val + 1)
    }, 1000)
  }, [recentDiscoveryInfo?.serverDate, shouldPoll])

  useEffect(() => {
    if (!shouldPoll) {
      if (requestInterval.current) {
        clearTimeout(requestInterval.current)
      }
      return
    }

    const reqId = requestId || selectedRequest?.id
    if (!reqId) return
    dispatch(fetchDiscoveryById({ requestId: reqId }))

    requestInterval.current = setInterval(() => {
      dispatch(fetchDiscoveryById({ requestId: reqId }))
    }, 10000) // Poll Every ten seconds

    return () => {
      if (requestInterval.current) {
        clearInterval(requestInterval.current)
      }
    }
  }, [dispatch, requestId, selectedRequest?.id, shouldPoll])

  const handleBack = useCallback(() => {
    if (viewState === 'begin') {
      onClose()
      return
    }

    if (viewState === 'results') {
      animateTransition('DiscoveryModeRoot.HandleBack')
      setViewState('begin')
      dispatch(discoverySlice.actions.clearSelections())
      fetchRecent()
    }
  }, [dispatch, fetchRecent, onClose, viewState])

  const handleNewSelected = useCallback(async () => {
    if (!hotspot.address || !userAddress) return

    animateTransition('DiscoveryModeRoot.HandleNewSelected')
    setViewState('results')

    dispatch(
      startDiscovery({
        hotspotAddress: hotspot.address,
        hotspotName: hotspot.name || animalName(hotspot.address),
      }),
    )
  }, [dispatch, hotspot.address, hotspot.name, userAddress])

  const handleRequestSelected = (request: DiscoveryRequest) => {
    dispatch(discoverySlice.actions.setSelectedRequest(request))
    animateTransition('DiscoveryModeRoot.HandleRequestSelected')
    setViewState('results')
  }

  useEffect(() => {
    enableBack(handleBack)
  }, [enableBack, handleBack])

  switch (viewState) {
    case 'begin':
      return (
        <DiscoveryModeBegin
          onRequestSelected={handleRequestSelected}
          onBeginNew={handleNewSelected}
          onClose={onClose}
          recentDiscoveryInfo={recentDiscoveryInfo}
          error={infoLoading === 'rejected'}
        />
      )
    case 'results':
      return (
        <DiscoveryModeResults
          request={selectedRequest}
          hotspot={hotspot}
          isPolling={shouldPoll}
          currentTime={time}
          requestTime={requestSeconds}
        />
      )
  }
}

export default memo(DiscoveryModeRoot)
