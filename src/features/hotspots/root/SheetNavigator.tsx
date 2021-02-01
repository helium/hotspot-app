import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HotspotsList from './HotspotsList'
import HotspotDetails from '../details/HotspotDetails'
import { HotspotStackParamList } from './hotspotTypes'

const HotspotsStack = createStackNavigator<HotspotStackParamList>()

const SheetNavigator = () => {
  return (
    <HotspotsStack.Navigator
      headerMode="none"
      screenOptions={{
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <HotspotsStack.Screen name="HotspotsScreen" component={HotspotsList} />
      <HotspotsStack.Screen name="HotspotDetails" component={HotspotDetails} />
    </HotspotsStack.Navigator>
  )
}

export default SheetNavigator
