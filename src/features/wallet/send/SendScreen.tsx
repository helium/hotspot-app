import React from 'react'
import Box from '../../../components/Box'
import SendView from './SendView'

const SendScreen = () => {
  return (
    <>
      <Box
        backgroundColor="white"
        flex={1}
        justifyContent="flex-start"
        alignContent="center"
        flexDirection="column"
      >
        <SendView />
      </Box>
    </>
  )
}

export default SendScreen
