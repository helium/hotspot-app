import React from 'react'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import { HttpTransaction } from '../../../../store/activity/activitySlice'
import { TxnTypeKeys } from '../walletTypes'

type Props = { item: HttpTransaction }
const UnknownTransaction = ({ item }: Props) => {
  if (TxnTypeKeys.find((k) => k === item.type)) {
    return null
  }

  return (
    <Box flex={1} marginTop="s" style={{ paddingBottom: 300 }}>
      <Box
        backgroundColor="grayBox"
        alignItems="center"
        overflow="scroll"
        padding="ms"
        flexDirection="row"
        borderRadius="m"
        justifyContent="space-between"
      >
        <Text
          variant="light"
          fontSize={13}
          color="black"
          flex={1}
          alignSelf="flex-start"
        >
          {JSON.stringify(item, null, 2)}
        </Text>
      </Box>
    </Box>
  )
}

export default UnknownTransaction
