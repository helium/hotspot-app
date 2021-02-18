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
  isVisible = true,
}: {
  animatedPosition: Animated.SharedValue<number>
  showWitnesses: boolean
  toggleShowWitnesses: () => void
  isVisible?: boolean
}) => {
  const style = useAnimatedStyle(
    () => ({
      position: 'absolute',
      bottom: -100,
      opacity: isVisible ? 1 : 0,
      transform: [
        {
          translateY: interpolate(
            animatedPosition.value,
            [-1, 0],
            [0, -320],
            Extrapolate.CLAMP,
          ),
        },
      ],
    }),
    [animatedPosition, isVisible],
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
