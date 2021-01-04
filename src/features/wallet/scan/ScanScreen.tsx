import { RouteProp } from '@react-navigation/native'
import React from 'react'
import Box from '../../../components/Box'
import { ScanStackParamList } from './scanTypes'
import ScanView from './ScanView'

type Route = RouteProp<ScanStackParamList, 'Scan'>

type Props = {
  route?: Route
}

const ScanScreen = ({ route }: Props) => {
  const fromSend = route?.params?.fromSend || false

  return (
    <Box
      backgroundColor="white"
      flex={1}
      justifyContent="flex-start"
      alignContent="center"
      flexDirection="column"
    >
      <ScanView fromSend={fromSend} />
    </Box>
  )
}

export default ScanScreen
