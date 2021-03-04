import React, { useMemo } from 'react'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import EyeCircleButton from '@assets/images/eye-circle-button.svg'
import EyeCircleButtonYellow from '@assets/images/eye-circle-button-yellow.svg'
import { ActivityIndicator } from 'react-native'
import Box from '../../../components/Box'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'

const HotspotMapButtons = ({
  animatedPosition,
  showWitnesses,
  toggleShowWitnesses,
  isVisible = true,
  loading,
}: {
  animatedPosition: Animated.SharedValue<number>
  showWitnesses: boolean
  toggleShowWitnesses: () => void
  isVisible?: boolean
  loading: boolean
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

  const loadingStyle = useMemo(
    () => ({
      backgroundColor: showWitnesses ? '#FCC945' : '#555A82',
      borderRadius: 22,
    }),
    [showWitnesses],
  )

  return (
    <Animated.View style={style}>
      <Box padding="m" flexDirection="row">
        {!loading && (
          <TouchableOpacityBox onPress={toggleShowWitnesses}>
            {showWitnesses ? <EyeCircleButtonYellow /> : <EyeCircleButton />}
          </TouchableOpacityBox>
        )}
        {loading && (
          <Box
            height={43}
            width={43}
            alignItems="center"
            justifyContent="center"
            style={loadingStyle}
          >
            <ActivityIndicator
              size="small"
              color={showWitnesses ? 'white' : 'black'}
            />
          </Box>
        )}

        {/* TODO: hex grid button */}
        {/* <TouchableOpacityBox marginStart="s"> */}
        {/*  <HexCircleButton /> */}
        {/* </TouchableOpacityBox> */}
      </Box>
    </Animated.View>
  )
}

export default HotspotMapButtons
