import React from 'react'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import EyeCircleButton from '@assets/images/eye-circle-button.svg'
import EyeCircleButtonYellow from '@assets/images/eye-circle-button-yellow.svg'
import Box from '../../../components/Box'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'

const HotspotMapButtons = ({
  animatedPosition,
  showWitnesses,
  toggleShowWitnesses,
}: {
  animatedPosition: Animated.SharedValue<number>
  showWitnesses: boolean
  toggleShowWitnesses: () => void
}) => {
  const style = useAnimatedStyle(
    () => ({
      position: 'absolute',
      bottom: -100,
      transform: [
        {
          translateY: interpolate(
            animatedPosition.value,
            [0, 1],
            [0, -340],
            Extrapolate.CLAMP,
          ),
        },
      ],
    }),
    [animatedPosition],
  )

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
