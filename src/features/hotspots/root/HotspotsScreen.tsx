import React from 'react'
import { useSelector } from 'react-redux'
import SafeAreaBox from '../../../components/SafeAreaBox'
import { RootState } from '../../../store/rootReducer'
import HotspotsEmpty from './HotspotsEmpty'
import HotspotsList from './HotspotsList'

const HotspotsScreen = () => {
  const {
    account: { hotspots },
  } = useSelector((state: RootState) => state)
  return (
    <SafeAreaBox backgroundColor="primaryBackground" flex={1} edges="top">
      {hotspots.length > 0 && <HotspotsList />}
      {hotspots.length === 0 && <HotspotsEmpty />}
    </SafeAreaBox>
  )
}

export default HotspotsScreen
