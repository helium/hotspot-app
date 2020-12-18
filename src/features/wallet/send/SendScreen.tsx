import React from 'react'
import Box from '../../../components/Box'
import SendView from './SendView'

const SendScreen = ({ route }) => {
  // TODO I might end up restructuring this concept or using redux
  // so not bothering with the types rn
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
