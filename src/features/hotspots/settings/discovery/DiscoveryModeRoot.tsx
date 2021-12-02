import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Hotspot, Witness } from '@helium/http'
import { useAsync } from 'react-async-hook'
import { Alert, Linking } from 'react-native'
import { useSelector } from 'react-redux'
import animalName from 'angry-purple-tiger'
import { useTranslation } from 'react-i18next'
import { isEqual } from 'lodash'
import discoverySlice, {
  fetchDiscoveryById,
  fetchRecentDiscoveries,
  startDiscovery,
} from '../../../../store/discovery/discoverySlice'
import {
  DiscoveryRequest,
  ViewState,
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
import { isDataOnly, isRelay } from '../../../../utils/hotspotUtils'
import Articles from '../../../../constants/articles'
import useDiscoveryPoll from './useDiscoveryPoll'
import useHotspotSync from '../../useHotspotSync'

type Props = { onClose: () => void; hotspot: Hotspot | Witness }
const DiscoveryModeRoot = ({ onClose, hotspot }: Props) => {
  const [viewState, setViewState] = useState<ViewState>('begin')
  const [errorShownForRequestId, setErrorShownForRequestId] = useState<
    Record<string, boolean>
  >({})
  const { t } = useTranslation()
  const { enableBack } = useHotspotSettingsContext()
  const { result: userAddress } = useAsync(getSecureItem, ['address'])
  const dispatch = useAppDispatch()
  const { polling, currentTime, requestTime, requestLength } = useDiscoveryPoll(
    {
      viewState,
      hotspot,
    },
  )
  const { showOKAlert } = useAlert()
  const { enabled, message } = useSelector(
    (state: RootState) => state.features.discovery,
  )
  const recentDiscoveryInfo = useSelector(
    (state: RootState) => state.discovery.recentDiscoveryInfos[hotspot.address],
    isEqual,
  )
  const infoLoading = useSelector(
    (state: RootState) => state.discovery.infoLoading,
  )
  const selectedRequest = useSelector(
    (state: RootState) => state.discovery.selectedRequest,
  )

  const { updateSyncStatus, hotspotSyncStatus } = useHotspotSync(hotspot)

  const fetchRecent = useCallback(() => {
    if (!hotspot.address || !userAddress) return

    dispatch(fetchRecentDiscoveries({ hotspotAddress: hotspot.address }))
  }, [dispatch, hotspot.address, userAddress])

  useMount(() => {
    dispatch(discoverySlice.actions.clearSelections())
    updateSyncStatus()
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

  const dispatchDiscovery = useCallback(() => {
    dispatch(
      startDiscovery({
        hotspotAddress: hotspot.address,
        hotspotName: hotspot.name || animalName(hotspot.address),
      }),
    )
    setViewState('results')
  }, [dispatch, hotspot])

  const dataOnly = useMemo(() => isDataOnly(hotspot), [hotspot])

  const handleNewSelected = useCallback(async () => {
    if (!hotspot.address || !userAddress) return

    if (dataOnly) {
      dispatchDiscovery()
      return
    }

    const status = hotspotSyncStatus?.status
    if (status !== 'full') {
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
            text: t('generic.continue'),
            onPress: () => dispatchDiscovery(),
          },
          {
            text: t('discovery.troubleshooting_guide'),
            style: 'cancel',
            onPress: () => {
              if (Linking.canOpenURL(Articles.Relay))
                Linking.openURL(Articles.Relay)
            },
          },
          {
            text: t('generic.cancel'),
            style: 'destructive',
          },
        ],
      )
    } else {
      dispatchDiscovery()
    }
  }, [
    hotspot.address,
    hotspot.status?.online,
    hotspot.status?.listenAddrs,
    userAddress,
    hotspotSyncStatus?.status,
    dataOnly,
    showOKAlert,
    t,
    dispatchDiscovery,
  ])

  const handleRequestSelected = useCallback(
    (request: DiscoveryRequest) => {
      dispatch(discoverySlice.actions.setSelectedRequest(request))
      dispatch(fetchDiscoveryById({ requestId: request.id }))
      animateTransition('DiscoveryModeRoot.HandleRequestSelected')
      setViewState('results')
    },
    [dispatch],
  )

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
          enabled={enabled}
          message={message}
        />
      )
    case 'results':
      return (
        <DiscoveryModeResults
          request={selectedRequest}
          hotspot={hotspot}
          isPolling={polling}
          currentTime={currentTime}
          requestTime={requestTime}
          requestLength={requestLength}
        />
      )
  }
}

export default memo(DiscoveryModeRoot)
