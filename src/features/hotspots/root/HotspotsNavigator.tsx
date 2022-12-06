import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import defaultScreenOptions from '../../../navigation/defaultScreenOptions'
import HotspotsScreen from './HotspotsScreen'
import HotspotLocationUpdateScreen from './HotspotLocationUpdateScreen'
import HotspotAntennaUpdateScreen from './HotspotAntennaUpdateScreen'
import { HotspotStackParamList } from './hotspotTypes'

const HotspotsStack = createStackNavigator<HotspotStackParamList>()

const Hotspots = () => {
  return (
    <HotspotsStack.Navigator
      headerMode="none"
      screenOptions={defaultScreenOptions}
    >
      <HotspotsStack.Screen name="HotspotsScreen" component={HotspotsScreen} />
      <HotspotsStack.Screen
        name="HotspotLocationUpdateScreen"
        component={HotspotLocationUpdateScreen}
      />
      <HotspotsStack.Screen
        name="HotspotAntennaUpdateScreen"
        component={HotspotAntennaUpdateScreen}
      />
    </HotspotsStack.Navigator>
  )
}

export default Hotspots
