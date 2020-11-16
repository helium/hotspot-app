import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { EducationStackParamList } from './educationTypes'
import HotspotEducationScreen from './hotspotEducation/HotspotEducationScreen'

const EducationStack = createStackNavigator<EducationStackParamList>()

const Education = () => {
  return (
    <EducationStack.Navigator headerMode="none">
      <EducationStack.Screen
        name="HotspotEducationScreen"
        component={HotspotEducationScreen}
      />
    </EducationStack.Navigator>
  )
}

export default Education
