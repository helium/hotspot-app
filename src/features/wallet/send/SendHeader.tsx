import React, { useCallback, useEffect } from 'react'
import { Keyboard } from 'react-native'
import { useTranslation } from 'react-i18next'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  WithTimingConfig,
} from 'react-native-reanimated'
import Box from '../../../components/Box'
import SendCircle from '../../../assets/images/send-circle.svg'
import HotspotOutlineIcon from '../../../assets/images/hotspotOutlineIcon.svg'
import Close from '../../../assets/images/close.svg'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Text from '../../../components/Text'
import { AppLinkCategoryType } from '../../../providers/appLinkTypes'

const ReanimatedBox = Animated.createAnimatedComponent(Box)

type Props = {
  type?: AppLinkCategoryType
  onClosePress: () => void
}

const SendHeader = ({ type, onClosePress }: Props) => {
  const { t } = useTranslation()

  const keyboardState = useSharedValue(0)

  const keyboardShow = useCallback(() => {
    keyboardState.value = 1
  }, [keyboardState])

  const keyboardHide = useCallback(() => {
    keyboardState.value = 0
  }, [keyboardState])

  useEffect(() => {
    const keyboardDidShowEmitter = Keyboard.addListener(
      'keyboardDidShow',
      keyboardShow,
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      keyboardHide,
    )
    return (): void => {
      keyboardDidShowEmitter.remove()
      keyboardDidHideListener.remove()
    }
  }, [keyboardHide, keyboardShow])

  const animatedOptions: WithTimingConfig = {
    duration: 300,
    easing: Easing.bezier(0.17, 0.59, 0.4, 0.77).factory(),
  }

  const containerStyles = useAnimatedStyle(() => {
    return {
      height: withTiming(
        keyboardState.value === 1 ? 100 : 250,
        animatedOptions,
      ),
    }
  })

  const miniHeaderStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(
            (1 - keyboardState.value) * -50,
            animatedOptions,
          ),
        },
      ],
      opacity: withTiming(keyboardState.value, animatedOptions),
    }
  })

  const mainHeaderStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(1 - keyboardState.value, animatedOptions),
    }
  })

  return (
    <ReanimatedBox
      style={containerStyles}
      backgroundColor="primaryBackground"
      padding="l"
    >
      <Box flexDirection="row" justifyContent="space-between" width="100%">
        <ReanimatedBox
          style={miniHeaderStyles}
          flexDirection="row"
          alignItems="center"
        >
          <SendCircle width={30} />
          <Text variant="h1" marginLeft="s" fontSize={24}>
            {type === 'payment' && t('send.title.payment')}
            {type === 'dc_burn' && t('send.title.dcBurn')}
            {type === 'transfer' && t('send.title.transfer')}
          </Text>
        </ReanimatedBox>
        <TouchableOpacityBox padding="m" onPress={onClosePress}>
          <Close color="white" width={22} height={22} />
        </TouchableOpacityBox>
      </Box>
      <ReanimatedBox
        style={mainHeaderStyles}
        justifyContent="flex-start"
        alignItems="center"
      >
        <Box marginBottom="m">
          {type === 'payment' && <SendCircle />}
          {type === 'dc_burn' && <SendCircle />}
          {type === 'transfer' && <HotspotOutlineIcon />}
        </Box>
        <Text variant="h2">
          {type === 'payment' && t('send.title.payment')}
          {type === 'dc_burn' && t('send.title.dcBurn')}
          {type === 'transfer' && t('send.title.transfer')}
        </Text>
      </ReanimatedBox>
    </ReanimatedBox>
  )
}

export default SendHeader
