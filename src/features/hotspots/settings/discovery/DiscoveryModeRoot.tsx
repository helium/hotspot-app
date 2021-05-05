import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Hotspot } from '@helium/http'
import { getUnixTime } from 'date-fns'
import { useAsync } from 'react-async-hook'
import { Alert, Linking } from 'react-native'
import { useSelector } from 'react-redux'
import animalName from 'angry-purple-tiger'
import { useTranslation } from 'react-i18next'
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
import useMount from '../../../../utils/useMount'
import useAlert from '../../../../utils/useAlert'
import {
  getSyncStatus,
  isRelay,
  SyncStatus,
} from '../../../../utils/hotspotUtils'

const troubleshootingURL =
  'https://intercom.help/heliumnetwork/en/articles/3207912-troubleshooting-network-connection-issues'

type State = 'begin' | 'results'

type Props = { onClose: () => void; hotspot: Hotspot }
const DiscoveryModeRoot = ({ onClose, hotspot }: Props) => {
  const [viewState, setViewState] = useState<State>('begin')
  const [errorShownForRequestId, setErrorShownForRequestId] = useState<
    Record<string, boolean>
  >({})
  const { t } = useTranslation()
  const [time, setTime] = useState(0)
  const { enableBack } = useHotspotSettingsContext()
  const { result: userAddress } = useAsync(getSecureItem, ['address'])
  const dispatch = useAppDispatch()
  const { showOKAlert } = useAlert()
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
  const blockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )

  const fetchRecent = useCallback(() => {
    if (!hotspot.address || !userAddress) return

    dispatch(fetchRecentDiscoveries({ hotspotAddress: hotspot.address }))
  }, [dispatch, hotspot.address, userAddress])

  useMount(() => {
    dispatch(discoverySlice.actions.clearSelections())
  })

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

  useEffect(() => {
    if (
      !selectedRequest ||
      !selectedRequest.errorCode ||
      errorShownForRequestId[selectedRequest.id]
    )
      return

    setErrorShownForRequestId((prev) => ({
      ...prev,
      [selectedRequest.id]: true,
    }))

    handleBack()
    showOKAlert({
      titleKey: 'discovery.session_error_prompt.title',
      messageKey: 'discovery.session_error_prompt.message',
    })
  }, [errorShownForRequestId, handleBack, selectedRequest, showOKAlert])

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

  const initiateDiscovery = useCallback(() => {
    dispatch(
      startDiscovery({
        hotspotAddress: hotspot.address,
        hotspotName: hotspot.name || animalName(hotspot.address),
      }),
    )
  }, [dispatch, hotspot.address, hotspot.name])

  const handleNewSelected = useCallback(async () => {
    if (!hotspot.address || !userAddress) return

    const hotspotHeight = hotspot.status?.height || 0
    const { status } = getSyncStatus(hotspotHeight, blockHeight)
    if (status !== SyncStatus.full) {
      showOKAlert({
        titleKey: 'discovery.syncing_prompt.title',
        messageKey: 'discovery.syncing_prompt.message',
      })
    } else if (hotspot.status?.online !== 'online') {
      showOKAlert({
        titleKey: 'discovery.offline_prompt.title',
        messageKey: 'discovery.offline_prompt.message',
      })
    } else if (isRelay(hotspot.status?.listenAddrs)) {
      Alert.alert(
        t('discovery.relay_prompt.title'),
        t('discovery.relay_prompt.message'),
        [
          {
            text: t('generic.ok'),
            onPress: () => initiateDiscovery(),
          },
          {
            text: t('discovery.troubleshooting_guide'),
            style: 'cancel',
            onPress: () => {
              if (Linking.canOpenURL(troubleshootingURL))
                Linking.openURL(troubleshootingURL)
            },
          },
          {
            text: t('generic.cancel'),
            style: 'destructive',
          },
        ],
      )
    } else {
      initiateDiscovery()
    }
  }, [blockHeight, hotspot, initiateDiscovery, showOKAlert, t, userAddress])

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
          hotspotAddress={hotspot.address}
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
