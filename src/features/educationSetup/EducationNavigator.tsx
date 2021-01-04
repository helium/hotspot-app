import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Platform } from 'react-native'
import { EducationStackParamList } from './educationTypes'
import DefaultScreenOptions from '../../navigation/defaultScreenOptions'
import SetupHotspotEducationScreen from './SetupHotspotEducationScreen'

const EducationStack = createStackNavigator<EducationStackParamList>()

const Education = () => {
  return (
    <EducationStack.Navigator
      headerMode="none"
      screenOptions={
        Platform.OS === 'android' ? DefaultScreenOptions : undefined
      }
      mode={Platform.OS === 'android' ? 'modal' : undefined}
    >
      <EducationStack.Screen
        name="SetupHotspotEducationScreen"
        component={SetupHotspotEducationScreen}
      />
    </EducationStack.Navigator>
  )
}

export default Education
