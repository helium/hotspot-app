import React from 'react'
import { AnyTransaction, PendingTransaction, TokenBurnV1 } from '@helium/http'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import { isPayer } from '../../../../utils/transactions'
import PaymentItem from './PaymentItem'

type Props = { item: AnyTransaction | PendingTransaction; address: string }
const Burn = ({ item, address }: Props) => {
  if (item.type !== 'token_burn_v1') return null

  const v1 = (item as unknown) as TokenBurnV1

  const payer = isPayer(address, item)
  return (
    <Box flex={1} marginTop={payer ? 'none' : 'm'}>
      <Text
        variant="light"
        fontSize={15}
        color="blueBright"
        alignSelf="flex-end"
        marginBottom="m"
      >
        {v1.fee && `-${v1.fee.toString()}`}
      </Text>

      <PaymentItem
        text={v1.payee}
        mode="to"
        isMyAccount={v1.payee === address}
      />
      <PaymentItem text={v1.memo} mode="memo" isFirst={false} isLast />
    </Box>
  )
}

export default Burn
