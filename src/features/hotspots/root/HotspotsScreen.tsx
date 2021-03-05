import React from 'react'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useSelector } from 'react-redux'
import SafeAreaBox from '../../../components/SafeAreaBox'
import { RootState } from '../../../store/rootReducer'
import HotspotsView from './HotspotsView'

const HotspotsScreen = () => {
  const { hotspots } = useSelector((state: RootState) => state.account)
  return (
    <SafeAreaBox backgroundColor="primaryBackground" flex={1} edges={['top']}>
      <BottomSheetModalProvider>
        <HotspotsView ownedHotspots={hotspots} />
      </BottomSheetModalProvider>
    </SafeAreaBox>
  )
}

export default HotspotsScreen
