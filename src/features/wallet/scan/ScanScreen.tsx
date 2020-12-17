import React from 'react'
import Box from '../../../components/Box'
import ScanView from './ScanView'

const ScanScreen = () => {
  return (
    <>
      <Box
        backgroundColor="white"
        flex={1}
        justifyContent="flex-start"
        alignContent="center"
        flexDirection="column"
      >
        <ScanView />
      </Box>
    </>
  )
}

export default ScanScreen
