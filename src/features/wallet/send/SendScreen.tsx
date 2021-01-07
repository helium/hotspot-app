import { RouteProp } from '@react-navigation/native'
import React from 'react'
import Box from '../../../components/Box'
import { SendStackParamList } from './sendTypes'
import SendView from './SendView'

type Route = RouteProp<SendStackParamList, 'Send'>

type Props = {
  route?: Route
}

const SendScreen = ({ route }: Props) => {
  const scanResult = route?.params?.scanResult

  return (
    <>
      <Box
        backgroundColor="white"
        flex={1}
        justifyContent="flex-start"
        alignContent="center"
        flexDirection="column"
      >
        <SendView scanResult={scanResult} />
      </Box>
    </>
  )
}

export default SendScreen
