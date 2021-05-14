import React, { memo, useEffect, useMemo, useState } from 'react'
import { Hotspot } from '@helium/http'
import { useTranslation } from 'react-i18next'
import { isEqual, startCase } from 'lodash'
import haversine from 'haversine-distance'
import { useSelector } from 'react-redux'
import Box from '../../../../components/Box'
import DiscoveryMap, { MapSelectDetail } from './DiscoveryMap'
import {
  DiscoveryRequest,
  DiscoveryResponse,
} from '../../../../store/discovery/discoveryTypes'
import animateTransition from '../../../../utils/animateTransition'
import { hp } from '../../../../utils/layout'
import { RootState } from '../../../../store/rootReducer'
import { useAppDispatch } from '../../../../store/store'
import { fetchNetworkHotspots } from '../../../../store/networkHotspots/networkHotspotsSlice'
import { getHotspotDetails } from '../../../../utils/appDataClient'
import DiscoveryModeResultsCard from './DiscoveryModeResultsCard'
import { usesMetricSystem } from '../../../../utils/i18n'
import filterDiscoveryResponses from './filterDiscoveryResponses'
import { locationIsValid } from '../../../../utils/location'

type Props = {
  request?: DiscoveryRequest | null
  hotspot: Hotspot
  isPolling: boolean
  requestTime: number
  currentTime: number
}
const DiscoveryModeResults = ({
  request,
  hotspot,
  isPolling,
  currentTime,
  requestTime,
}: Props) => {
  const { t } = useTranslation()
  const [filteredResponses, setFilteredResponses] = useState<
    DiscoveryResponse[]
  >([])
  const [overlayDetails, setOverlayDetails] = useState<
    {
      distance: string
      rewardScale: string
    } & MapSelectDetail
  >()
  const dispatch = useAppDispatch()
  const networkHotspots = useSelector(
    (state: RootState) => state.networkHotspots.networkHotspots,
    isEqual,
  )

  const assertedhotspotCoords = useSelector(
    (state: RootState) => state.discovery.mapCoords,
  )

  const mapCenter = useMemo(() => {
    // request coords take precendence
    if (
      request?.lat &&
      request.lng &&
      request.lng !== '0' &&
      request.lat !== '0'
    ) {
      return [parseFloat(request.lng), parseFloat(request.lat)]
    }

    if (locationIsValid(assertedhotspotCoords)) return assertedhotspotCoords
  }, [assertedhotspotCoords, request])

  useEffect(() => {
    if (!mapCenter && filteredResponses.length === 0) return

    const oneMileInDegrees = 1 / 69 // close enough => depends on your location. It's 68.7 at the equator and 69.4 at the poles, but yolo
    const offset = 15 * oneMileInDegrees // TODO: 15 mile offset. Is this adequate?
    const center = mapCenter || [
      filteredResponses[0].long,
      filteredResponses[0].lat,
    ] // If we're using the hotspot's physical location, use the first responder as center
    const northEastCoordinates = [
      center[0] + offset,
      center[1] + offset,
    ] as GeoJSON.Position
    const southWestCoordinates = [
      center[0] - offset,
      center[1] - offset,
    ] as GeoJSON.Position

    dispatch(fetchNetworkHotspots([southWestCoordinates, northEastCoordinates])) // find all hotspots 15 miles in every direction
  }, [dispatch, filteredResponses, mapCenter])

  useEffect(() => {
    if (request) {
      setFilteredResponses(
        filterDiscoveryResponses(hotspot.address, request.responses),
      )
    }
  }, [hotspot.address, request])

  const showOverlay = async ({ name, lat, lng, address }: MapSelectDetail) => {
    let distance = ''
    if (hotspot.lat && hotspot.lng) {
      const haversineDistance =
        haversine({ lat: hotspot.lat, lng: hotspot.lng }, { lat, lng }) / 1000

      const localizedDistance = usesMetricSystem
        ? haversineDistance
        : haversineDistance * 0.621371
      const localizedUnit = usesMetricSystem ? 'km' : 'miles'

      distance = t('discovery.results.distance', {
        distance: localizedDistance.toFixed(1),
        unit: localizedUnit,
      })

      const deets = await getHotspotDetails(address)

      const rewardScale = deets?.rewardScale
        ? `${deets.rewardScale.toFixed(3)}`
        : ''

      animateTransition('DiscoveryModeResults.ShowOverlay')
      setOverlayDetails({
        lat,
        lng,
        name: startCase(name),
        distance,
        rewardScale,
        address,
      })
    }
  }

  const hideOverlay = () => {
    animateTransition('DiscoveryMode.HideOverlay')
    setOverlayDetails(undefined)
  }

  return (
    <Box height={hp(85)}>
      <DiscoveryMap
        networkHotspots={networkHotspots}
        hotspotAddress={hotspot.address}
        mapCenter={mapCenter}
        responses={filteredResponses}
        onSelect={showOverlay}
        selectedHotspot={overlayDetails}
        isPolling={isPolling}
      />
      <DiscoveryModeResultsCard
        numResponses={filteredResponses.length}
        request={request}
        isPolling={isPolling}
        overlayDetails={overlayDetails}
        hideOverlay={hideOverlay}
        requestTime={requestTime}
        currentTime={currentTime}
      />
    </Box>
  )
}

export default memo(DiscoveryModeResults)
