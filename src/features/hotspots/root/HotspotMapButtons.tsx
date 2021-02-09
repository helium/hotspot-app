import React, { memo, useMemo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
// import Animated, { Extrapolate } from 'react-native-reanimated'
import Animated from 'react-native-reanimated'
import EyeCircleButton from '@assets/images/eye-circle-button.svg'
import EyeCircleButtonYellow from '@assets/images/eye-circle-button-yellow.svg'
import Box from '../../../components/Box'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'

// const DETAIL_COLLAPSED_CARD_HEIGHT = 120

const HotspotMapButtons = ({
  // animatedPosition,
  showWitnesses,
  toggleShowWitnesses,
}: {
  // animatedPosition: Animated.Value<number>
  showWitnesses: boolean
  toggleShowWitnesses: () => void
}) => {
  const style: StyleProp<Animated.AnimateStyle<ViewStyle>> = useMemo(() => {
    return [
      {
        position: 'absolute',
        bottom: 250,
        // bottom: -60,
      },
      // {
      //   transform: [
      //     {
      //       translateY: animatedPosition.interpolate({
      //         inputRange: [0, DETAIL_COLLAPSED_CARD_HEIGHT],
      //         outputRange: [0, -DETAIL_COLLAPSED_CARD_HEIGHT - 120],
      //         extrapolate: Extrapolate.CLAMP,
      //       }),
      //     },
      //   ],
      // },
    ]
  }, [])

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

export default memo(HotspotMapButtons)
