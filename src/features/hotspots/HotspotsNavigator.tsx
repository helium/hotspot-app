import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import defaultScreenOptions from '../../navigation/defaultScreenOptions'
import StatsScreen from '../stats/StatsScreen'

const HotspotsStack = createStackNavigator()

const Hotspots = () => {
  return (
    <HotspotsStack.Navigator
      headerMode="none"
      screenOptions={defaultScreenOptions}
    >
      <HotspotsStack.Screen name="StatsScreen" component={StatsScreen} />
    </HotspotsStack.Navigator>
  )
}

export default Hotspots
