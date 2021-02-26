import React from 'react'
import { Linking } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import Portal from '@burstware/react-native-portal'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { useTranslation } from 'react-i18next'
import { useActionSheet } from '@expo/react-native-action-sheet'
import Text from './Text'
import { Colors, Spacing, TextVariant } from '../theme/theme'
import TouchableOpacityBox from './TouchableOpacityBox'
import { EXPLORER_BASE_URL } from '../utils/config'
import { triggerNavHaptic } from '../utils/haptic'
import Box from './Box'

type Props = {
  address: string | undefined
  color?: Colors
  variant?: TextVariant
  fontSize?: number
  ellipsizeMode?: 'head' | 'middle' | 'tail'
  maxWidth?: number
  text?: string
  clickToCopy?: boolean
  padding?: Spacing
}

type AddressOption = { label: string; action?: () => void }

const Address = ({
  address,
  text,
  color = 'black',
  fontSize = 14,
  variant = 'medium',
  ellipsizeMode = 'middle',
  maxWidth,
  clickToCopy,
  padding,
}: Props) => {
  const { t } = useTranslation()
  const { showActionSheetWithOptions } = useActionSheet()
  const toastPosition = useSharedValue(-100)
  const toastStyle = useAnimatedStyle(() => {
    return {
      bottom: toastPosition.value,
    }
  })

  function showToast() {
    'worklet'

    toastPosition.value = withSpring(100, { stiffness: 500, damping: 25 })
  }

  function hideToast() {
    'worklet'

    toastPosition.value = withSpring(-100)
  }

  if (!address) return null

  const truncatedAddress = [address.slice(0, 8), address.slice(-8)].join('...')

  const goToExplorer = () => {
    if (address) {
      Linking.openURL(`${EXPLORER_BASE_URL}/accounts/${address}`)
    }
  }

  const copyAddress = () => {
    Clipboard.setString(address)
    showToast()
    setTimeout(() => hideToast(), 3000)
    triggerNavHaptic()
  }

  const opts: AddressOption[] = [
    {
      label: `${t('generic.copy')} ${t('generic.address')}`,
      action: copyAddress,
    },
    {
      label: t('hotspot_details.options.viewExplorer'),
      action: goToExplorer,
    },
    {
      label: t('generic.cancel'),
    },
  ]

  const onPress = () => {
    if (clickToCopy) {
      copyAddress()
    } else {
      showActionSheetWithOptions(
        {
          options: opts.map(({ label }) => label),
          cancelButtonIndex: opts.length - 1,
        },
        (buttonIndex) => {
          opts[buttonIndex].action?.()
        },
      )
    }
  }

  return (
    <>
      <TouchableOpacityBox
        onPress={onPress}
        maxWidth={maxWidth}
        onLongPress={copyAddress}
      >
        <Text
          variant={variant}
          fontSize={fontSize}
          color={color}
          numberOfLines={1}
          ellipsizeMode={ellipsizeMode}
          padding={padding}
        >
          {text || address}
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

export default Address
