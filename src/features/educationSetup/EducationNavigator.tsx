import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { EducationStackParamList } from './educationTypes'
import HotspotEducationScreen from './hotspotEducation/HotspotEducationScreen'
import AccountEndSetupScreen from './end/AccountEndSetupScreen'
import EnableNotificationsScreen from './enableNotifications/EnableNotificationsScreen'
import DefaultScreenOptions from '../../navigation/defaultScreenOptions'

const EducationStack = createStackNavigator<EducationStackParamList>()

const Education = () => {
  return (
    <EducationStack.Navigator
      headerMode="none"
      screenOptions={DefaultScreenOptions}
    >
      <EducationStack.Screen
        name="HotspotEducationScreen"
        component={HotspotEducationScreen}
      />
      <EducationStack.Screen
        name="AccountEndSetupScreen"
        component={AccountEndSetupScreen}
      />
      <EducationStack.Screen
        name="EnableNotificationsScreen"
        component={EnableNotificationsScreen}
      />
    </EducationStack.Navigator>
  )
}

export default Education
