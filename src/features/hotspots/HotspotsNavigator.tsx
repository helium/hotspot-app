import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import defaultScreenOptions from '../../navigation/defaultScreenOptions'
import HotspotsScreen from './HotspotsScreen'

const HotspotsStack = createStackNavigator()

const Hotspots = () => {
  return (
    <HotspotsStack.Navigator
      headerMode="none"
      screenOptions={defaultScreenOptions}
    >
      <HotspotsStack.Screen name="HotspotsScreen" component={HotspotsScreen} />
    </HotspotsStack.Navigator>
  )
}

export default Hotspots
