/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, useMemo, useCallback } from 'react'
import QRCode from 'react-qr-code'
import { useAsync } from 'react-async-hook'
import { BoxProps } from '@shopify/restyle'
import CopyAddress from '@assets/images/copyAddress.svg'
import ShareAddress from '@assets/images/shareAddress.svg'
import { useTranslation } from 'react-i18next'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'
import { Share } from 'react-native'
import Box from '../../../components/Box'
import { getSecureItem } from '../../../utils/secureAccount'
import { Spacing, Theme } from '../../../theme/theme'
import { useSpacing } from '../../../theme/themeHooks'
import { DebouncedTouchableOpacityBox } from '../../../components/TouchableOpacityBox'
import Text from '../../../components/Text'
import useHaptic from '../../../utils/useHaptic'

type Props = BoxProps<Theme>

const QR_CONTAINER_SIZE = 146

const WalletAddress = ({ ...boxProps }: Props) => {
  const { result: address, loading } = useAsync(getSecureItem, ['address'])
  const { triggerNavHaptic } = useHaptic()
  const spacing = useSpacing()
  const padding = useMemo(() => 'm' as Spacing, [])
  const { t } = useTranslation()

  const showToast = useCallback(() => {
    if (!address) return
    Toast.show(
      t('wallet.copiedToClipboard', {
        address: [address.slice(0, 8), address.slice(-8)].join('...'),
      }),
    )
  }, [address, t])

  const copyAddress = useCallback(() => {
    if (!address) return

    Clipboard.setString(address)
    showToast()
    triggerNavHaptic()
  }, [address, showToast, triggerNavHaptic])

  const handleShare = useCallback(() => {
    if (!address) return

    Share.share({ message: address })
    triggerNavHaptic()
  }, [address, triggerNavHaptic])

  if (loading || !address) return null

  return (
    <Box alignItems="center" {...boxProps}>
      <Box
        height={QR_CONTAINER_SIZE}
        width={QR_CONTAINER_SIZE}
        backgroundColor="white"
        padding={padding}
        borderRadius="xl"
      >
        <QRCode
          size={QR_CONTAINER_SIZE - 2 * spacing[padding]}
          value={address}
        />
      </Box>
      <Box flexDirection="row" alignItems="center" marginTop="lx">
        <DebouncedTouchableOpacityBox
          flexDirection="row"
          backgroundColor="greenBright"
          borderRadius="round"
          alignItems="center"
          padding="m"
          justifyContent="center"
          onPress={copyAddress}
          marginRight="ms"
        >
          <CopyAddress />
          <Text
            marginLeft="s"
            variant="medium"
            fontSize={17}
            color="purpleDark"
          >
            {t('generic.copy_address')}
          </Text>
        </DebouncedTouchableOpacityBox>
        <DebouncedTouchableOpacityBox
          flexDirection="row"
          padding="m"
          backgroundColor="purpleMain"
          borderRadius="round"
          onPress={handleShare}
        >
          <ShareAddress />
          <Text marginLeft="s" variant="medium" fontSize={17} color="white">
            {t('generic.share')}
          </Text>
        </DebouncedTouchableOpacityBox>
      </Box>
    </Box>
  )
}

export default memo(WalletAddress)
