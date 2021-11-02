import { RouteProp, useRoute } from '@react-navigation/native'
import React, { memo } from 'react'
import SafeAreaBox from '../../components/SafeAreaBox'
import Text from '../../components/Text'
import { RootStackParamList } from '../../navigation/main/tabTypes'

type Route = RouteProp<RootStackParamList, 'LinkWallet'>
const LinkWallet = () => {
  const { params } = useRoute<Route>()
  return (
    <SafeAreaBox backgroundColor="yellow" flex={1} padding="xl">
      <Text variant="body2">{JSON.stringify(params, null, 2)}</Text>
    </SafeAreaBox>
  )
}

export default memo(LinkWallet)
