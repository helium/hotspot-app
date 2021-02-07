import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import React from 'react'
import { useSelector } from 'react-redux'
import SafeAreaBox from '../../../components/SafeAreaBox'
import { RootState } from '../../../store/rootReducer'
import HotspotsEmpty from './HotspotsEmpty'
import HotspotsView from './HotspotsView'

const HotspotsScreen = () => {
  const {
    account: { hotspots },
  } = useSelector((state: RootState) => state)
  return (
    <SafeAreaBox backgroundColor="primaryBackground" flex={1} edges={['top']}>
      <BottomSheetModalProvider>
        {hotspots.length > 0 && <HotspotsView ownedHotspots={hotspots} />}
        {hotspots.length === 0 && <HotspotsEmpty />}
      </BottomSheetModalProvider>
    </SafeAreaBox>
  )
}

export default HotspotsScreen
