import { RouteProp } from '@react-navigation/native'
import React from 'react'
import Box from '../../../components/Box'
import { SendStackParamList, SendType } from './sendTypes'
import SendView from './SendView'

type Route = RouteProp<SendStackParamList, 'Send'>

type Props = {
  route?: Route
  sendType?: SendType
}

const SendScreen = ({ route, sendType }: Props) => {
  const scanResult = route?.params?.scanResult

  console.log(sendType)

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
