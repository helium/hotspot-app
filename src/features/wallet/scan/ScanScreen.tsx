import React from 'react'
import { RouteProp } from '@react-navigation/native'
import Box from '../../../components/Box'
import ScanView from './ScanView'
import { ScanStackParamList } from './scanTypes'

type Route = RouteProp<ScanStackParamList, 'Scan'>

type Props = {
  route?: Route
}

const ScanScreen = ({ route }: Props) => {
  const type = route?.params?.type
  return (
    <Box
      backgroundColor="white"
      flex={1}
      justifyContent="flex-start"
      alignContent="center"
      flexDirection="column"
    >
      <ScanView scanType={type} showBottomSheet={type !== 'transfer'} />
    </Box>
  )
}

export default ScanScreen
