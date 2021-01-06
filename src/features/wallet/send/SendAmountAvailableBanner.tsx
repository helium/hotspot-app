import React from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Text from '../../../components/Text'

type Props = {
  amount: number // TODO this will actually be a Balance
  flex?: number
}

const SendAmountAvailableBanner = ({ amount, flex }: Props) => {
  const { t } = useTranslation()

  return (
    <Box flex={flex} backgroundColor="purple200" padding="m">
      <Text variant="mono" color="blueGrayLight" textAlign="center">
        {t('send.available', {
          amount: amount.toLocaleString(),
        })}
      </Text>
    </Box>
  )
}

export default SendAmountAvailableBanner
