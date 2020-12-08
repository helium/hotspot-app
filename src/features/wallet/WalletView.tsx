import React from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../components/Box'
import Text from '../../components/Text'
import BarChart from '../../components/BarChart'

const WalletView = () => {
  const { t } = useTranslation()

  return (
    <Box height="100%">
      <Text variant="header" style={{ fontSize: 22 }}>
        {t('wallet.title')}
      </Text>
      <BarChart height={150} />
    </Box>
  )
}

export default WalletView
