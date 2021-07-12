import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import WalletHeader from './WalletHeader'

type Props = {
  handleScanPressed: () => void
}

const WalletEmpty = ({ handleScanPressed }: Props) => {
  const { t } = useTranslation()

  return (
    <Box alignContent="center" padding="xl" paddingTop="none" flex={1}>
      <WalletHeader
        handleScanPressed={handleScanPressed}
        hideTitle
        flex={1}
        marginRight="n_xl"
      />
      <Text
        variant="h1"
        fontSize={43}
        maxFontSizeMultiplier={1}
        numberOfLines={2}
        textAlign="center"
        marginBottom="xl"
        adjustsFontSizeToFit
      >
        {t('wallet.empty.title')}
      </Text>
      <Text
        variant="bold"
        fontSize={17}
        maxFontSizeMultiplier={1.2}
        numberOfLines={1}
        textAlign="center"
        marginBottom="s"
        adjustsFontSizeToFit
      >
        {t('wallet.empty.subtitle')}
      </Text>
      <Text
        variant="light"
        fontSize={15}
        maxFontSizeMultiplier={1.2}
        numberOfLines={2}
        textAlign="center"
        marginBottom="xl"
        adjustsFontSizeToFit
      >
        {t('wallet.empty.description')}
      </Text>
    </Box>
  )
}

export default memo(WalletEmpty)
