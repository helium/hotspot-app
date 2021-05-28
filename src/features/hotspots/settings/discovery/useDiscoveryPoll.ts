import { Hotspot } from '@helium/http'
import { getUnixTime } from 'date-fns'
import { isEqual } from 'lodash'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchDiscoveryById } from '../../../../store/discovery/discoverySlice'
import { ViewState } from '../../../../store/discovery/discoveryTypes'
import { RootState } from '../../../../store/rootReducer'
import { useAppDispatch } from '../../../../store/store'

type Props = { viewState: ViewState; hotspot: Hotspot }

const unixTime = (dateStr?: string) => {
  const insertDate = dateStr ? new Date(dateStr) : null
  if (!insertDate) return 0

  return getUnixTime(insertDate)
}
const useDiscoveryPoll = ({ viewState, hotspot }: Props) => {
  const clockInterval = useRef<NodeJS.Timeout>()
  const dispatch = useAppDispatch()
  const request = useSelector(
    (state: RootState) => state.discovery.selectedRequest,
  )
  const loading = useSelector(
    (state: RootState) => state.discovery.requestLoading,
  )
  const requestId = useSelector((state: RootState) => state.discovery.requestId)
  const recentDiscoveryInfo = useSelector(
    (state: RootState) => state.discovery.recentDiscoveryInfos[hotspot.address],
    isEqual,
  )

  const [requestTime, setRequestTime] = useState(0)
  const [serverTime, setServerTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [requestLength, setRequestLength] = useState(60)
  const canFetch = useRef(true)

  const polling = useMemo(() => {
    if (viewState === 'begin') return false

    if (!request) {
      return true
    }
    return currentTime - requestTime < requestLength
  }, [currentTime, request, requestLength, requestTime, viewState])

  const fetchDiscovery = useCallback(() => {
    if (!requestId || !polling || loading === 'pending' || !canFetch.current) {
      return
    }

    canFetch.current = false
    dispatch(fetchDiscoveryById({ requestId }))
  }, [dispatch, loading, polling, requestId])

  useEffect(() => {
    if (clockInterval.current) {
      clearInterval(clockInterval.current)
    }

    if (requestId && polling) {
      clockInterval.current = setInterval(() => {
        setCurrentTime((val) => val + 1)
      }, 1000)
    }

    return () => {
      if (clockInterval.current) {
        clearInterval(clockInterval.current)
      }
    }
  }, [requestId, polling])

  useEffect(() => {
    fetchDiscovery()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId])

  useEffect(() => {
    if (!recentDiscoveryInfo?.requestLength) return

    setRequestLength(recentDiscoveryInfo.requestLength)
  }, [recentDiscoveryInfo])

  useEffect(() => {
    const reqTime = unixTime(request?.insertedAt)
    const servTime = unixTime(
      request?.serverDate || recentDiscoveryInfo?.serverDate,
    )
    setRequestTime(reqTime)
    setServerTime(servTime)
    setCurrentTime(servTime)
  }, [recentDiscoveryInfo?.serverDate, request])

  useEffect(() => {
    canFetch.current = true
  }, [serverTime])

  useEffect(() => {
    if (polling && currentTime - serverTime >= 10) {
      fetchDiscovery()
    }
  }, [currentTime, fetchDiscovery, polling, serverTime, requestId])

  return {
    polling,
    currentTime,
    requestTime,
    requestLength,
  }
}

export default useDiscoveryPoll
