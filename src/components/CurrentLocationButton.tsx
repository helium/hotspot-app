import React from 'react'
import { Image } from 'react-native'
import TouchableOpacityBox from './TouchableOpacityBox'

type Props = { onPress: () => void }
const CurrentLocationButton = ({ onPress }: Props) => {
  return (
    <TouchableOpacityBox
      onPress={onPress}
      position="absolute"
      width={32}
      height={32}
      bottom={16}
      left={16}
    >
      <Image source={require('../assets/images/current-location.png')} />
    </TouchableOpacityBox>
  )
}

export default CurrentLocationButton
