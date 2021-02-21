import Balance, { NetworkTokens } from '@helium/currency'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { RootState } from '../../../store/rootReducer'

type Props = {
  amount?: Balance<NetworkTokens>
  flex?: number
}

const SendAmountAvailableBanner = ({ amount, flex }: Props) => {
  const { t } = useTranslation()
  const {
    app: { groupSeparator, decimalSeparator },
  } = useSelector((state: RootState) => state)

  return (
    <Box flex={flex} backgroundColor="purple200" padding="m">
      <Text variant="mono" color="blueGrayLight" textAlign="center">
        {t('send.available', {
          amount: amount?.toString(3, {
            groupSeparator,
            decimalSeparator,
          }),
        })}
      </Text>
    </Box>
  )
}

export default SendAmountAvailableBanner
