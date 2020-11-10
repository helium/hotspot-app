import React from 'react'
import Box from './Box'
import Image from './ImageBox'

const UserLocationMap = () => {
  return (
    <Box position="absolute" height="100%" width="100%">
      <Image
        source={require('../assets/images/background-map.png')}
        top={0}
        left={0}
        height="100%"
        width="100%"
        position="absolute"
        resizeMode="cover"
      />
    </Box>
  )
}

export default UserLocationMap
