import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Hotspot, Witness } from '@helium/http'
import { useSelector } from 'react-redux'
import Box from '../../../../components/Box'
import DiscoveryMap from './DiscoveryMap'
import {
  DiscoveryRequest,
  DiscoveryResponse,
} from '../../../../store/discovery/discoveryTypes'
import animateTransition from '../../../../utils/animateTransition'
import { hp } from '../../../../utils/layout'
import DiscoveryModeResultsCard from './DiscoveryModeResultsCard'
import dedupeDiscoveryResponses from './dedupeDiscoveryResponses'
import { useAppDispatch } from '../../../../store/store'
import { fetchHotspotsForHex } from '../../../../store/discovery/discoverySlice'
import { RootState } from '../../../../store/rootReducer'

type Props = {
  request?: DiscoveryRequest | null
  hotspot: Hotspot | Witness
  isPolling: boolean
  requestTime: number
  currentTime: number
  requestLength: number
}
const DiscoveryModeResults = ({
  request,
  hotspot,
  isPolling,
  currentTime,
  requestTime,
  requestLength,
}: Props) => {
  const dispatch = useAppDispatch()
  const hotspotsForHexId = useSelector(
    (state: RootState) => state.discovery.hotspotsForHexId,
  )
  const [selectedHexId, setSelectedHexId] = useState<string>()
  const [responses, setResponses] = useState<DiscoveryResponse[]>([])

  const selectedHotspots = useMemo(() => {
    if (!selectedHexId) return []
    return hotspotsForHexId[selectedHexId]
  }, [hotspotsForHexId, selectedHexId])

  useEffect(() => {
    if (request) {
      setResponses(dedupeDiscoveryResponses(request.responses))
    }
  }, [hotspot.address, request])

  const showOverlay = useCallback(
    async (hexId: string) => {
      animateTransition('DiscoveryMode.ShowOverlay')
      setSelectedHexId(hexId)
      dispatch(fetchHotspotsForHex({ hexId }))
    },
    [dispatch],
  )

  const hideOverlay = useCallback(() => {
    animateTransition('DiscoveryMode.HideOverlay')
    setSelectedHexId(undefined)
  }, [])

  return (
    <Box height={hp(85)}>
      <DiscoveryMap
        responses={responses}
        onSelectHex={showOverlay}
        selectedHexId={selectedHexId}
      />
      <DiscoveryModeResultsCard
        responses={responses}
        request={request}
        isPolling={isPolling}
        selectedHotspots={selectedHotspots}
        hideOverlay={hideOverlay}
        requestTime={requestTime}
        currentTime={currentTime}
        requestLength={requestLength}
      />
    </Box>
  )
}

export default memo(DiscoveryModeResults)
