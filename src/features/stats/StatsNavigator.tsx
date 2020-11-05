import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import StatsScreen from './StatsScreen'

const StatsStack = createStackNavigator()

const Stats = () => {
  return (
    <StatsStack.Navigator headerMode="none">
      <StatsStack.Screen name="Stats" component={StatsScreen} />
    </StatsStack.Navigator>
  )
}

export default Stats
