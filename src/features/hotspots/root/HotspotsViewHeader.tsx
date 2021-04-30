import React, { useMemo } from 'react'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import EyeCircleButton from '@assets/images/eye-circle-button.svg'
import EyeCircleButtonYellow from '@assets/images/eye-circle-button-yellow.svg'
import { ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Text from '../../../components/Text'

const HotspotsViewHeader = ({
  animatedPosition,
  showWitnesses,
  toggleShowWitnesses,
  buttonsVisible = true,
  loading,
  detailHeaderHeight,
  showNoLocation,
}: {
  animatedPosition: Animated.SharedValue<number>
  showWitnesses: boolean
  toggleShowWitnesses: () => void
  buttonsVisible?: boolean
  loading: boolean
  detailHeaderHeight: number
  showNoLocation: boolean
}) => {
  const { t } = useTranslation()
  const style = useAnimatedStyle(
    () => ({
      position: 'absolute',
      bottom: -100,
      left: 0,
      right: 0,
      opacity: buttonsVisible || showNoLocation ? 1 : 0,
      transform: [
        {
          translateY: interpolate(
            animatedPosition.value,
            [-1, 0],
            [0, -1 * (detailHeaderHeight + (showNoLocation ? 80 : 220))],
            Extrapolate.CLAMP,
          ),
        },
      ],
    }),
    [animatedPosition, buttonsVisible, detailHeaderHeight],
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
      <Box padding="m" flexDirection="row" alignItems="center">
        {!loading && buttonsVisible && (
          <TouchableOpacityBox onPress={toggleShowWitnesses} width={44}>
            {showWitnesses ? <EyeCircleButtonYellow /> : <EyeCircleButton />}
          </TouchableOpacityBox>
        )}
        {loading && buttonsVisible && (
          <Box
            height={44}
            width={44}
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
        {showNoLocation && (
          <Text
            variant="medium"
            fontSize={22}
            color="white"
            maxFontSizeMultiplier={1}
            flex={1}
            textAlign="center"
          >
            {t('hotspot_details.no_location')}
          </Text>
        )}
        <Box height={44} width={44} />
      </Box>
    </Animated.View>
  )
}

export default HotspotsViewHeader
