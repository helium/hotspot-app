import Balance, { NetworkTokens } from '@helium/currency'
import React, { memo, useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import Box from '../../components/Box'
import Text from '../../components/Text'
import useCurrency from '../../utils/useCurrency'

export type ConsensusItem = { block: number; amount: Balance<NetworkTokens> }
type Props = {
  item: ConsensusItem
  isFirst: boolean
  isLast: boolean
}
const ValidatorDetailsConsensusItem = ({
  item: { block, amount },
  isFirst,
  isLast,
}: Props) => {
  const { hntBalanceToDisplayVal } = useCurrency()
  const { t } = useTranslation()
  const [amountDisplay, setAmountDisplay] = useState('')

  useEffect(() => {
    const updateBalance = async () => {
      const bal = await hntBalanceToDisplayVal(amount, false)
      setAmountDisplay(bal)
    }
    updateBalance()
  }, [hntBalanceToDisplayVal, amount])

  return (
    <Box
      backgroundColor="grayPurpleLight"
      marginBottom="xxxs"
      flexDirection="row"
      borderTopLeftRadius={isFirst ? 'm' : 'none'}
      borderTopRightRadius={isFirst ? 'm' : 'none'}
      borderBottomLeftRadius={isLast ? 'm' : 'none'}
      borderBottomRightRadius={isLast ? 'm' : 'none'}
      padding="m"
      alignItems="center"
    >
      <Box flex={1}>
        <Text color="purpleMediumText" variant="medium" fontSize={15}>
          {t('validator_details.consensus_group')}
        </Text>
        <Text color="purpleMediumText" variant="regular" fontSize={13}>
          {t('validator_details.block_elected', {
            block,
          })}
        </Text>
      </Box>
      <Text variant="medium" color="grayDarkText" fontSize={15}>
        {amountDisplay}
      </Text>
    </Box>
  )
}

export default memo(ValidatorDetailsConsensusItem)
