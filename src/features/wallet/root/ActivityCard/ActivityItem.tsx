import React, { memo, useMemo } from 'react'
import { createText } from '@shopify/restyle'
import {
  AnyTransaction,
  PendingTransaction,
  AddGatewayV1,
  AssertLocationV1,
} from '@helium/http'
import animalName from 'angry-purple-tiger'
import Box from '../../../../components/Box'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import { Theme } from '../../../../theme/theme'
import useActivityItem from '../useActivityItem'

export const ACTIVITY_ITEM_ROW_HEIGHT = 58

type Props = {
  isFirst: boolean
  isLast: boolean
  handlePress: () => void
  item: AnyTransaction | PendingTransaction
  address: string
}

const Text = createText<Theme>()

const ActivityItem = ({
  isFirst = false,
  isLast = false,
  handlePress,
  item,
  address,
}: Props) => {
  const txn = useActivityItem(item, address)
  const iconStyle = useMemo(
    () => ({
      backgroundColor: txn.backgroundColor,
    }),
    [txn.backgroundColor],
  )

  const subtitle = useMemo(() => {
    if (item instanceof AssertLocationV1 || item instanceof AddGatewayV1) {
      return animalName(item.gateway)
    }
    if ('txn' in item && item?.txn?.gateway) {
      return animalName(item.txn.gateway)
    }
    return txn.amount
  }, [txn.amount, item])

  return (
    <TouchableOpacityBox
      onPress={handlePress}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      borderColor="grayLight"
      borderWidth={1}
      borderBottomWidth={isLast ? 1 : 0}
      borderTopLeftRadius={isFirst ? 'm' : undefined}
      borderTopRightRadius={isFirst ? 'm' : undefined}
      borderBottomLeftRadius={isLast ? 'm' : undefined}
      borderBottomRightRadius={isLast ? 'm' : undefined}
    >
      <Box
        width={ACTIVITY_ITEM_ROW_HEIGHT}
        height={ACTIVITY_ITEM_ROW_HEIGHT}
        style={iconStyle}
        justifyContent="center"
        alignItems="center"
        borderTopLeftRadius={isFirst ? 'm' : undefined}
        borderBottomLeftRadius={isLast ? 'm' : undefined}
      >
        {txn.listIcon}
      </Box>
      <Box flex={1} paddingHorizontal="m">
        <Text
          variant="body2Medium"
          color="black"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {txn.title}
        </Text>
        <Text
          color="grayExtraLight"
          variant="body2"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {subtitle}
        </Text>
      </Box>
      <Box paddingHorizontal="m">
        {!!txn.time && <Text color="graySteel">{txn.time}</Text>}
      </Box>
    </TouchableOpacityBox>
  )
}

export default memo(ActivityItem)
