import React, { useEffect, useState } from 'react'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { Hotspot } from '@helium/http'
import { useSelector } from 'react-redux'
import SafeAreaBox from '../../../components/SafeAreaBox'
import { RootState } from '../../../store/rootReducer'
import HotspotsEmpty from './HotspotsEmpty'
import HotspotsView from './HotspotsView'

const HotspotsScreen = () => {
  const {
    account: { hotspots },
  } = useSelector((state: RootState) => state)
  const [ownedHotspots, setOwnedHotspots] = useState<Hotspot[]>([])

  useEffect(() => {
    if (ownedHotspots.length !== hotspots.length) {
      setOwnedHotspots(hotspots)
    }
  }, [hotspots, ownedHotspots])

  return (
    <SafeAreaBox backgroundColor="primaryBackground" flex={1} edges={['top']}>
      <BottomSheetModalProvider>
        {ownedHotspots.length > 0 && (
          <HotspotsView ownedHotspots={ownedHotspots} />
        )}
        {hotspots.length === 0 && <HotspotsEmpty />}
      </BottomSheetModalProvider>
    </SafeAreaBox>
  )
}

export default HotspotsScreen
