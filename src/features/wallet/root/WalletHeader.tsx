/* eslint-disable react/jsx-props-no-spreading */
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import Qr from '@assets/images/qr.svg'
import { BoxProps } from '@shopify/restyle'
import { Insets } from 'react-native'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { Theme } from '../../../theme/theme'

type Props = BoxProps<Theme> & {
  handleScanPressed: () => void
}

const hitSlop = { top: 12, bottom: 12, left: 24, right: 24 } as Insets
const WalletHeader = ({ handleScanPressed, ...boxProps }: Props) => {
  const { t } = useTranslation()

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="l"
      paddingVertical="l"
      zIndex={1}
      {...boxProps}
    >
      <Text variant="h1" fontSize={22} maxFontSizeMultiplier={1.2}>
        {t('wallet.title')}
      </Text>

      <Box flexDirection="row" justifyContent="flex-end">
        <TouchableOpacityBox
          onPress={handleScanPressed}
          padding="s"
          hitSlop={hitSlop}
        >
          <Qr width={22} height={22} color="white" />
        </TouchableOpacityBox>
      </Box>
    </Box>
  )
}

export default memo(WalletHeader)
