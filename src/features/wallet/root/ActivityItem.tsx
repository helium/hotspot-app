import React, { useMemo, memo } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { formatDistanceToNow, fromUnixTime } from 'date-fns'
import animalHash from 'angry-purple-tiger'
import { useTheme } from '@shopify/restyle'
import { useTranslation } from 'react-i18next'
import {
  AnyTransaction,
  RewardsV1,
  AddGatewayV1,
  AssertLocationV1,
  PaymentV2,
  PaymentV1,
  PendingTransaction,
} from '@helium/http'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import shortLocale from '../../../utils/formatDistance'
import Rewards from '../../../assets/images/rewards.svg'
import SentHnt from '../../../assets/images/sentHNT.svg'
import HotspotAdded from '../../../assets/images/hotspotAdded.svg'
import ReceivedHnt from '../../../assets/images/receivedHNT.svg'
import Location from '../../../assets/images/location.svg'
import { triggerNotification } from '../../../utils/haptic'
import { Theme } from '../../../theme/theme'
import { isPayer } from '../../../utils/transactions'

type Props = {
  item: AnyTransaction | PendingTransaction
  isFirst: boolean
  isLast: boolean
  address?: string | null
}

const TxnTypeKeys = [
  'rewards_v1',
  'payment_v1',
  'payment_v2',
  'add_gateway_v1',
  'assert_location_v1',
] as const
type TxnType = typeof TxnTypeKeys[number]

const ActivityItem = ({
  item,
  isFirst = false,
  isLast = false,
  address = '',
}: Props) => {
  const theme = useTheme<Theme>()
  const { t } = useTranslation()

  const isSending = useMemo(() => isPayer(address, item), [address, item])

  const amount = useMemo(() => {
    if (item instanceof AddGatewayV1) {
      return animalHash(item.gateway)
    }
    if (item instanceof AssertLocationV1) {
      return `-${item.fee.toLocaleString()}`
    }
    if (item instanceof RewardsV1 || item instanceof PaymentV2) {
      return `+${item.totalAmount.toString()}`
    }
    if (item instanceof PaymentV1) {
      return `+${item.amount.floatBalance.toString()}`
    }
    const pendingTxn = item as PendingTransaction
    if (pendingTxn.txn !== undefined) {
      if (pendingTxn.txn.type === 'add_gateway_v1') {
        return animalHash((pendingTxn.txn as AddGatewayV1).gateway)
      }
      return `-${pendingTxn.txn.fee.toLocaleString()}`
    }

    return ''
  }, [item])

  const time = useMemo(() => {
    let val: Date
    const pending = item as PendingTransaction
    if (pending.txn !== undefined) {
      val = new Date(pending.createdAt)
    } else {
      val = fromUnixTime((item as AddGatewayV1).time)
    }

    if (val) {
      return formatDistanceToNow(val, {
        locale: shortLocale,
        addSuffix: true,
      })
    }

    return undefined
  }, [item])

  const titles = (type: string) => {
    if (!TxnTypeKeys.find((k) => k === type)) {
      return type
    }

    switch (type as TxnType) {
      case 'add_gateway_v1':
        return t('transactions.added')
      case 'payment_v1':
      case 'payment_v2':
        return isSending ? t('transactions.sent') : t('transactions.received')
      case 'assert_location_v1':
        return t('transactions.location')
      case 'rewards_v1':
        return t('transactions.mining')
    }
  }

  const colors = (type: string) => {
    if (!TxnTypeKeys.find((k) => k === type)) {
      return theme.colors.primaryBackground
    }

    switch (type as TxnType) {
      case 'add_gateway_v1':
        return theme.colors.purple100
      case 'payment_v1':
      case 'payment_v2':
        return isSending ? theme.colors.blueBright : theme.colors.greenMain
      case 'assert_location_v1':
        return theme.colors.purpleMuted
      case 'rewards_v1':
        return theme.colors.purpleBright
    }
  }

  const icon = (type: string) => {
    if (!TxnTypeKeys.find((k) => k === type)) {
      return null
    }

    const size = 24
    switch (type as TxnType) {
      case 'add_gateway_v1':
        return <HotspotAdded width={size} height={size} />
      case 'payment_v1':
      case 'payment_v2':
        return isSending ? (
          <SentHnt width={size} height={size} />
        ) : (
          <ReceivedHnt width={size} height={size} />
        )
      case 'assert_location_v1':
        return <Location width={size} height={size} />
      case 'rewards_v1':
        return <Rewards width={size} height={size} />
    }
  }

  const handlePress = () => {
    triggerNotification()
  }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Box
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
          width={50}
          height={50}
          style={{ backgroundColor: colors(item.type) }}
          justifyContent="center"
          alignItems="center"
          borderTopLeftRadius={isFirst ? 'm' : undefined}
          borderBottomLeftRadius={isLast ? 'm' : undefined}
        >
          {icon(item.type)}
        </Box>
        <Box flex={1} paddingHorizontal="m">
          <Text fontSize={14} lineHeight={20} fontWeight="500">
            {titles(item.type)}
          </Text>
          <Text color="grayExtraLight" fontSize={14} lineHeight={20}>
            {amount}
          </Text>
        </Box>
        <Box paddingHorizontal="m">
          {time && <Text color="graySteel">{time}</Text>}
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default memo(ActivityItem)
