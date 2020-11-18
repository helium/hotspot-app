import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { EducationStackParamList } from './educationTypes'
import HotspotEducationScreen from './hotspotEducation/HotspotEducationScreen'
import AccountEndSetupScreen from './end/AccountEndSetupScreen'
import EnableNotificationsScreen from './enableNotifications/EnableNotificationsScreen'

const EducationStack = createStackNavigator<EducationStackParamList>()

const Education = () => {
  return (
    <EducationStack.Navigator headerMode="none">
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
