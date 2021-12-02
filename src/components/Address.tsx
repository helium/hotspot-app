/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { Linking } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { useTranslation } from 'react-i18next'
import { useActionSheet } from '@expo/react-native-action-sheet'
import Toast from 'react-native-simple-toast'
import Text from './Text'
import TouchableOpacityBox from './TouchableOpacityBox'
import { EXPLORER_BASE_URL } from '../utils/config'
import useHaptic from '../utils/useHaptic'

type Props = React.ComponentProps<typeof Text> & {
  address: string | undefined
  maxWidth?: number
  text?: string
  clickToCopy?: boolean
  type?: 'account' | 'txn'
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
  type = 'account',
  ...rest
}: Props) => {
  const { t } = useTranslation()
  const { triggerNavHaptic } = useHaptic()
  const { showActionSheetWithOptions } = useActionSheet()

  const showToast = () => {
    Toast.show(t('wallet.copiedToClipboard', { address: truncatedAddress }))
  }

  if (!address) return null

  const truncatedAddress = [address.slice(0, 8), address.slice(-8)].join('...')

  const goToExplorer = () => {
    if (address) {
      Linking.openURL(`${EXPLORER_BASE_URL}/${type}s/${address}`)
    }
  }

  const copyAddress = () => {
    Clipboard.setString(address)
    showToast()
    triggerNavHaptic()
  }

  const opts: AddressOption[] = [
    {
      label: `${t('generic.copy')} ${t(`copyAddress.${type}`)}`,
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
          opts[buttonIndex || 0].action?.()
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
          maxFontSizeMultiplier={1.3}
          variant={variant}
          fontSize={fontSize}
          color={color}
          numberOfLines={1}
          ellipsizeMode={ellipsizeMode}
          {...rest}
        >
          {text || address}
        </Text>
      </TouchableOpacityBox>
    </>
  )
}

export default Address
