import * as React from 'react'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import defaultScreenOptions from '../../../navigation/defaultScreenOptions'
import HotspotsScreen from './HotspotsScreen'
import HotspotDetails from '../details/HotspotDetails'
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
        name="HotspotDetails"
        component={HotspotDetails}
        options={TransitionPresets.ModalTransition}
      />
    </HotspotsStack.Navigator>
  )
}

export default Hotspots
