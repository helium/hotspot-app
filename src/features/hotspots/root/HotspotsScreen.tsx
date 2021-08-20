import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useSelector } from 'react-redux'
import { ActivityIndicator } from 'react-native'
import { RootState } from '../../../store/rootReducer'
import HotspotsView from './HotspotsView'
import Box from '../../../components/Box'
import {
  fetchHotspotsData,
  fetchRewards,
} from '../../../store/hotspots/hotspotsSlice'
import useVisible from '../../../utils/useVisible'
import { useAppDispatch } from '../../../store/store'
import useGetLocation from '../../../utils/useGetLocation'
import useAlert from '../../../utils/useAlert'
import appSlice from '../../../store/user/appSlice'

const HotspotsScreen = () => {
  const maybeGetLocation = useGetLocation()
  const { showOKAlert } = useAlert()
  const hotspots = useSelector((state: RootState) => state.hotspots.hotspots)
  const hiddenAddresses = useSelector(
    (state: RootState) => state.hotspots.hiddenAddresses,
  )
  const showHiddenHotspots = useSelector(
    (state: RootState) => state.app.showHiddenHotspots,
  )
  const followedHotspots = useSelector(
    (state: RootState) => state.hotspots.followedHotspots,
  )
  const hotspotsLoaded = useSelector(
    (state: RootState) => state.hotspots.hotspotsLoaded,
  )
  const fleetModeEnabled = useSelector(
    (state: RootState) => state.app.isFleetModeEnabled,
  )
  const hasFleetModeAutoEnabled = useSelector(
    (state: RootState) => state.app.hasFleetModeAutoEnabled,
  )
  const fleetModeLowerLimit = useSelector(
    (state: RootState) => state.features.fleetModeLowerLimit,
  )

  const [startOnMap, setStartOnMap] = useState(false)
  const dispatch = useAppDispatch()
  const { currentLocation: location } = useSelector(
    (state: RootState) => state.location,
  )

  const visibleHotspots = useMemo(() => {
    if (showHiddenHotspots) {
      return hotspots
    }
    return hotspots.filter((h) => !hiddenAddresses.has(h.address)) || []
  }, [hiddenAddresses, hotspots, showHiddenHotspots])

  const browseMap = useCallback(async () => {
    setStartOnMap(true)
    maybeGetLocation(true)
  }, [maybeGetLocation])

  const coords = useMemo(() => {
    return [location?.longitude || 0, location?.latitude || 0]
  }, [location?.latitude, location?.longitude])

  useEffect(() => {
    if (
      fleetModeEnabled ||
      hasFleetModeAutoEnabled === undefined ||
      hasFleetModeAutoEnabled ||
      fleetModeLowerLimit === undefined ||
      visibleHotspots.length < fleetModeLowerLimit
    )
      return

    dispatch(
      appSlice.actions.updateFleetModeEnabled({
        enabled: true,
        autoEnabled: true,
      }),
    )
    showOKAlert({
      titleKey: 'fleetMode.autoEnablePrompt.title',
      messageKey: 'fleetMode.autoEnablePrompt.subtitle',
    })
  }, [
    dispatch,
    fleetModeEnabled,
    fleetModeLowerLimit,
    hasFleetModeAutoEnabled,
    visibleHotspots,
    showOKAlert,
  ])

  useVisible({
    onAppear: () => {
      dispatch(fetchHotspotsData())
      maybeGetLocation(false)
    },
  })

  useEffect(() => {
    dispatch(fetchRewards({ fetchType: fleetModeEnabled ? 'followed' : 'all' }))
  }, [visibleHotspots, dispatch, fleetModeEnabled])

  const viewState = useMemo(() => {
    if (!hotspotsLoaded) return 'loading'
    if (
      visibleHotspots.length === 0 &&
      followedHotspots.length === 0 &&
      !location
    )
      return 'empty'
    return 'view'
  }, [
    followedHotspots.length,
    visibleHotspots.length,
    hotspotsLoaded,
    location,
  ])

  return (
    <Box backgroundColor="primaryBackground" flex={1}>
      <BottomSheetModalProvider>
        {viewState !== 'loading' && (
          <HotspotsView
            ownedHotspots={visibleHotspots}
            followedHotspots={followedHotspots}
            startOnMap={startOnMap}
            location={coords}
            onRequestShowMap={browseMap}
          />
        )}
        {viewState === 'loading' && (
          <Box justifyContent="center" flex={1}>
            <ActivityIndicator color="gray" />
          </Box>
        )}
      </BottomSheetModalProvider>
    </Box>
  )
}

export default HotspotsScreen
