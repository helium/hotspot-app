import React from 'react'
import Animated from 'react-native-reanimated'
import EyeCircleButton from '@assets/images/eye-circle-button.svg'
import EyeCircleButtonYellow from '@assets/images/eye-circle-button-yellow.svg'
import Box from '../../../components/Box'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'

const HotspotMapButtons = ({
  style,
  showWitnesses,
  toggleShowWitnesses,
}: {
  style: any
  showWitnesses: boolean
  toggleShowWitnesses: () => void
}) => {
  return (
    <Animated.View style={style}>
      <Box padding="m" flexDirection="row">
        <TouchableOpacityBox onPress={toggleShowWitnesses}>
          {showWitnesses ? <EyeCircleButtonYellow /> : <EyeCircleButton />}
        </TouchableOpacityBox>
        {/* TODO: hex grid button */}
        {/* <TouchableOpacityBox marginStart="s"> */}
        {/*  <HexCircleButton /> */}
        {/* </TouchableOpacityBox> */}
      </Box>
    </Animated.View>
  )
}

export default HotspotMapButtons
