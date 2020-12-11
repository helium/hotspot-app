import React from 'react'
import Box from '../../../components/Box'
import DC from '../../../assets/images/dc.svg'
import HST from '../../../assets/images/hst.svg'
import Text from '../../../components/Text'

type Props = {
  variant: 'dc' | 'hst'
  amount: number
}

const CurrencyBadge = ({ variant, amount }: Props) => (
  <Box
    flexDirection="row"
    backgroundColor="purple300"
    borderRadius="m"
    alignItems="center"
    justifyContent="center"
    padding="s"
    marginRight="m"
  >
    {variant === 'dc' && <DC height={16} />}
    {variant === 'hst' && <HST width={16} />}
    <Text color="white" marginLeft="xs" fontSize={14}>
      {amount.toLocaleString()}
    </Text>
  </Box>
)

export default CurrencyBadge
