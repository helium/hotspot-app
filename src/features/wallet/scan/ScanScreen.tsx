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
  const showBottomSheet = route?.params?.showBottomSheet
  return (
    <Box
      backgroundColor="white"
      flex={1}
      justifyContent="flex-start"
      alignContent="center"
      flexDirection="column"
    >
      <ScanView scanType={type} showBottomSheet={showBottomSheet} />
    </Box>
  )
}

export default ScanScreen
