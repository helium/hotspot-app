import React from 'react'
import DC from '@assets/images/dc.svg'
import HST from '@assets/images/hst.svg'
import STAKE from '@assets/images/stakeCloud.svg'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import { locale } from '../../../../utils/i18n'

type Props = {
  variant: 'dc' | 'hst' | 'stake'
  amount: number
}

const CurrencyBadge = ({ variant, amount }: Props) => (
  <Box
    flexDirection="row"
    backgroundColor="purple300"
    borderRadius="round"
    alignItems="center"
    justifyContent="center"
    paddingHorizontal="s"
    height={30}
    marginRight="m"
  >
    {variant === 'dc' && <DC height={16} />}
    {variant === 'hst' && <HST width={16} />}
    {variant === 'stake' && <STAKE width={16} />}
    <Text color="white" marginLeft="xs" fontSize={14}>
      {amount.toLocaleString(locale)}
    </Text>
  </Box>
)

export default CurrencyBadge
