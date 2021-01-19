import React from 'react'
import Clipboard from '@react-native-community/clipboard'
import Portal from '@burstware/react-native-portal'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { useTranslation } from 'react-i18next'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { triggerNavHaptic } from '../../../utils/haptic'
import Box from '../../../components/Box'

const SLICE_SIZE = 8

const CopyAddressButton = ({ address }: { address?: string }) => {
  const { t } = useTranslation()
  const toastPosition = useSharedValue(-100)

  const toastStyle = useAnimatedStyle(() => {
    return {
      bottom: toastPosition.value,
    }
  })

  if (!address) return null

  const truncatedAddress = [
    address.slice(0, SLICE_SIZE),
    address.slice(-SLICE_SIZE),
  ].join('...')

  function showToast() {
    'worklet'

    toastPosition.value = withSpring(100, { stiffness: 500, damping: 25 })
  }

  function hideToast() {
    'worklet'

    toastPosition.value = withSpring(-100)
  }

  const handleCopyPress = () => {
    Clipboard.setString(address)
    showToast()
    setTimeout(() => hideToast(), 3000)
    triggerNavHaptic()
  }

  return (
    <>
      <TouchableOpacityBox padding="s" onPress={handleCopyPress}>
        <Text variant="body1Mono" color="white" textAlign="center">
          {truncatedAddress}
        </Text>
      </TouchableOpacityBox>
      <Portal>
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
            },
            toastStyle,
          ]}
        >
          <Box
            backgroundColor="grayDark"
            borderRadius="round"
            paddingVertical="s"
            paddingHorizontal="m"
            opacity={0.98}
          >
            <Text variant="body2" color="white" textAlign="center">
              {t('wallet.copiedToClipboard', { address: truncatedAddress })}
            </Text>
          </Box>
        </Animated.View>
      </Portal>
    </>
  )
}

export default CopyAddressButton
