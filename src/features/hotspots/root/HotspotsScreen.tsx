import React, { useState, useEffect } from 'react'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useDispatch, useSelector } from 'react-redux'
import * as Location from 'expo-location'
import { LocationObject } from 'expo-location'
import { useAsync } from 'react-async-hook'
import { useNavigation } from '@react-navigation/native'
import SafeAreaBox from '../../../components/SafeAreaBox'
import { RootState } from '../../../store/rootReducer'
import HotspotsView from './HotspotsView'
import HotspotsEmpty from './HotspotsEmpty'
import Box from '../../../components/Box'
import { fetchHotspotsData } from '../../../store/hotspots/hotspotsSlice'

const HotspotsScreen = () => {
  const navigation = useNavigation()
  const hotspots = useSelector((state: RootState) => state.hotspots.hotspots)
  const [location, setLocation] = useState<LocationObject>()
  const [startOnMap, setStartOnMap] = useState(false)
  const dispatch = useDispatch()
  const getLocation = async () => {
    setStartOnMap(true)
    const { status } = await Location.requestPermissionsAsync()
    if (status !== 'granted') return
    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    })
    setLocation(currentLocation)
  }

  useAsync(async () => {
    const { status } = await Location.getPermissionsAsync()
    if (status !== 'granted') return
    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    })
    setLocation(currentLocation)
  }, [])

  useEffect(() => {
    return navigation.addListener('focus', () => {
      dispatch(fetchHotspotsData())
    })
  }, [navigation, dispatch])

  return (
    <SafeAreaBox backgroundColor="primaryBackground" flex={1} edges={['top']}>
      <BottomSheetModalProvider>
        {hotspots.length === 0 && !location ? (
          <Box flex={1} justifyContent="center">
            <HotspotsEmpty onOpenExplorer={getLocation} />
          </Box>
        ) : (
          <HotspotsView
            ownedHotspots={hotspots}
            startOnMap={startOnMap}
            location={[
              location?.coords.longitude || 0,
              location?.coords.latitude || 0,
            ]}
          />
        )}
      </BottomSheetModalProvider>
    </SafeAreaBox>
  )
}

export default HotspotsScreen
