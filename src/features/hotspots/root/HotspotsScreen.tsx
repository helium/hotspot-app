import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useSelector } from 'react-redux'
import { PermissionResponse } from 'expo-permissions'
import { ActivityIndicator } from 'react-native'
import SafeAreaBox from '../../../components/SafeAreaBox'
import { RootState } from '../../../store/rootReducer'
import HotspotsView from './HotspotsView'
import HotspotsEmpty from './HotspotsEmpty'
import Box from '../../../components/Box'
import {
  fetchFollowedHotspotsFromBlock,
  fetchHotspotsData,
  fetchRewards,
} from '../../../store/hotspots/hotspotsSlice'
import useVisible from '../../../utils/useVisible'
import locationSlice, {
  getLocationPermission,
  getLocation,
} from '../../../store/location/locationSlice'
import usePermissionManager from '../../../utils/usePermissionManager'
import { useAppDispatch } from '../../../store/store'

const HotspotsScreen = () => {
  const hotspots = useSelector((state: RootState) => state.hotspots.hotspots)
  const followedHotspots = useSelector(
    (state: RootState) => state.hotspots.followedHotspots,
  )
  const hotspotsLoaded = useSelector(
    (state: RootState) => state.hotspots.hotspotsLoaded,
  )
  const [startOnMap, setStartOnMap] = useState(false)
  const dispatch = useAppDispatch()
  const { requestLocationPermission } = usePermissionManager()
  const {
    currentLocation: location,
    permissionResponse,
    locationBlocked,
  } = useSelector((state: RootState) => state.location)

  const maybeGetLocation = useCallback(
    async (okToPromptUser: boolean) => {
      // We don't know if we can request location
      let permResponse = permissionResponse
      if (!permResponse) {
        const { payload } = await dispatch(getLocationPermission())
        permResponse = payload as PermissionResponse
      }
      if (!permResponse) return // this shouldn't happen unless shit hits the fan

      if (permResponse.granted) {
        dispatch(getLocation())
      } else if (okToPromptUser && permResponse.canAskAgain) {
        const response = await requestLocationPermission()

        if (response) {
          dispatch(locationSlice.actions.updateLocationPermission(response))
        }

        if (response && response.granted) {
          dispatch(getLocation())
        }
      }
    },
    [requestLocationPermission, dispatch, permissionResponse],
  )

  const browseMap = useCallback(async () => {
    setStartOnMap(true)
    maybeGetLocation(true)
  }, [maybeGetLocation])

  const coords = useMemo(() => {
    return [location?.longitude || 0, location?.latitude || 0]
  }, [location?.latitude, location?.longitude])

  useVisible({
    onAppear: () => {
      dispatch(fetchHotspotsData())
      maybeGetLocation(false)
    },
  })

  useEffect(() => {
    // dispatch(fetchHotspotsData()) will trigger an update to hotspots
    // anytime hotspots update, update rewards and following
    // Separating these calls allows the UI to respond more quickly
    dispatch(fetchFollowedHotspotsFromBlock())
    dispatch(fetchRewards())
  }, [hotspots, dispatch])

  const viewState = useMemo(() => {
    if (!hotspotsLoaded) return 'loading'
    if (hotspots.length === 0 && followedHotspots.length === 0 && !location)
      return 'empty'
    return 'view'
  }, [followedHotspots.length, hotspots.length, hotspotsLoaded, location])

  return (
    <SafeAreaBox backgroundColor="primaryBackground" flex={1} edges={['top']}>
      <BottomSheetModalProvider>
        {viewState === 'empty' && (
          <Box flex={1} justifyContent="center">
            <HotspotsEmpty
              onOpenExplorer={browseMap}
              locationBlocked={locationBlocked}
            />
          </Box>
        )}
        {viewState === 'view' && (
          <HotspotsView
            ownedHotspots={hotspots}
            followedHotspots={followedHotspots}
            startOnMap={startOnMap}
            location={coords}
          />
        )}
        {viewState === 'loading' && (
          <Box justifyContent="center" flex={1}>
            <ActivityIndicator color="gray" />
          </Box>
        )}
      </BottomSheetModalProvider>
    </SafeAreaBox>
  )
}

export default HotspotsScreen
