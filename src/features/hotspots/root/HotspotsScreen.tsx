import React, { useEffect, useState, useMemo, useCallback, memo } from 'react'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useSelector } from 'react-redux'
import { ActivityIndicator } from 'react-native'
import { RootState } from '../../../store/rootReducer'
import HotspotsView from './HotspotsView'
import Box from '../../../components/Box'
import { fetchHotspotsData } from '../../../store/hotspots/hotspotsSlice'
import { useAppDispatch } from '../../../store/store'
import useGetLocation from '../../../utils/useGetLocation'
import useAlert from '../../../utils/useAlert'
import { updateFleetModeEnabled } from '../../../store/account/accountSlice'
import useMount from '../../../utils/useMount'

const HotspotsScreen = () => {
  const maybeGetLocation = useGetLocation()
  const { showOKAlert } = useAlert()
  const validators = useSelector(
    (state: RootState) => state.validators.validators.data,
  )
  const followedValidators = useSelector(
    (state: RootState) => state.validators.followedValidators.data,
  )
  const hotspots = useSelector(
    (state: RootState) => state.hotspots.hotspots.data,
  )
  const hiddenAddresses = useSelector(
    (state: RootState) => state.account.settings.hiddenAddresses,
  )
  const showHiddenHotspots = useSelector(
    (state: RootState) => state.account.settings.showHiddenHotspots,
  )
  const followedHotspots = useSelector(
    (state: RootState) => state.hotspots.followedHotspots.data,
  )
  const hotspotsLoaded = useSelector(
    (state: RootState) => state.hotspots.hotspotsLoaded,
  )
  const fleetModeEnabled = useSelector(
    (state: RootState) => state.account.settings.isFleetModeEnabled,
  )
  const hasFleetModeAutoEnabled = useSelector(
    (state: RootState) => state.account.settings.hasFleetModeAutoEnabled,
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
    return hotspots.filter((h) => !hiddenAddresses?.includes(h.address)) || []
  }, [hiddenAddresses, hotspots, showHiddenHotspots])

  const browseMap = useCallback(async () => {
    setStartOnMap(true)
    maybeGetLocation(true)
  }, [maybeGetLocation])

  const coords = useMemo(() => {
    return [location?.longitude || 0, location?.latitude || 0]
  }, [location?.latitude, location?.longitude])

  useEffect(() => {
    // TODO: Add validators into this check
    if (
      fleetModeEnabled ||
      hasFleetModeAutoEnabled === undefined ||
      hasFleetModeAutoEnabled ||
      fleetModeLowerLimit === undefined ||
      visibleHotspots.length < fleetModeLowerLimit
    )
      return

    dispatch(
      updateFleetModeEnabled({
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

  useMount(() => {
    dispatch(fetchHotspotsData())
    maybeGetLocation(false)
  })

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
            ownedValidators={validators}
            followedValidators={followedValidators}
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

export default memo(HotspotsScreen)
