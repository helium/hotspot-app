import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useSelector } from 'react-redux'
import { ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
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
import { useAppDispatch } from '../../../store/store'
import useGetLocation from '../../../utils/useGetLocation'

const HotspotsScreen = () => {
  const maybeGetLocation = useGetLocation()
  const hotspots = useSelector((state: RootState) => state.hotspots.hotspots)
  const insets = useSafeAreaInsets()
  const followedHotspots = useSelector(
    (state: RootState) => state.hotspots.followedHotspots,
  )
  const hotspotsLoaded = useSelector(
    (state: RootState) => state.hotspots.hotspotsLoaded,
  )
  const [startOnMap, setStartOnMap] = useState(false)
  const dispatch = useAppDispatch()
  const { currentLocation: location, locationBlocked } = useSelector(
    (state: RootState) => state.location,
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

  const containerStyle = useMemo(() => ({ paddingTop: insets.top }), [
    insets.top,
  ])

  return (
    <Box backgroundColor="primaryBackground" flex={1} style={containerStyle}>
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
            onViewMap={maybeGetLocation}
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
