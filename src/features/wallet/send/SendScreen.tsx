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
  const type = route?.params?.type
  const hotspot = route?.params?.hotspot
  const isSeller = route?.params?.isSeller
  return (
    <>
      <Box
        backgroundColor="white"
        flex={1}
        justifyContent="flex-start"
        alignContent="center"
        flexDirection="column"
      >
        <SendView
          scanResult={scanResult}
          sendType={type}
          hotspot={hotspot}
          isSeller={isSeller}
        />
      </Box>
    </>
  )
}

export default SendScreen
