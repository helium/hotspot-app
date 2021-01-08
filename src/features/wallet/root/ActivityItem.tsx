import React, { useMemo, memo, useCallback } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { formatDistanceToNow, fromUnixTime } from 'date-fns'
import animalHash from 'angry-purple-tiger'
import { useTranslation } from 'react-i18next'
import {
  AnyTransaction,
  RewardsV1,
  AddGatewayV1,
  AssertLocationV1,
  PaymentV2,
  PaymentV1,
  PendingTransaction,
  TransferHotspotV1,
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
import { isPayer } from '../../../utils/transactions'
import { useColors } from '../../../theme/themeHooks'

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
  'transfer_hotspot_v1',
] as const
type TxnType = typeof TxnTypeKeys[number]

const ActivityItem = ({
  item,
  isFirst = false,
  isLast = false,
  address = '',
}: Props) => {
  const colors = useColors()
  const { t } = useTranslation()

  const isSending = useMemo(() => isPayer(address, item), [address, item])

  const amount = useMemo(() => {
    if (item instanceof AddGatewayV1) {
      return animalHash(item.gateway)
    }
    if (item instanceof AssertLocationV1 || item instanceof TransferHotspotV1) {
      return `${
        item.fee && item.fee !== 0 ? '-' : ''
      }${item.fee?.toLocaleString()}`
    }
    if (item instanceof RewardsV1) {
      return `+${item.totalAmount.toString()}`
    }
    if (item instanceof PaymentV1) {
      return `${isSending ? '-' : '+'}${item.amount.floatBalance.toString()}`
    }
    if (item instanceof PaymentV2) {
      return `${
        isSending ? '-' : '+'
      }${item.totalAmount.floatBalance.toString()}`
    }
    const pendingTxn = item as PendingTransaction
    if (pendingTxn.txn !== undefined) {
      if (pendingTxn.txn.type === 'add_gateway_v1') {
        return animalHash((pendingTxn.txn as AddGatewayV1).gateway)
      }
      return `-${pendingTxn.txn.fee.toLocaleString()}`
    }

    return ''
  }, [item, isSending])

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

  const titles = useCallback(
    (type: string) => {
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
        case 'transfer_hotspot_v1':
          return t('transactions.transfer')
        case 'rewards_v1':
          return t('transactions.mining')
      }
    },
    [isSending, t],
  )

  const iconBackgroundColor = useCallback(
    (type: string) => {
      if (!TxnTypeKeys.find((k) => k === type)) {
        return colors.primaryBackground
      }

      switch (type as TxnType) {
        case 'transfer_hotspot_v1':
        case 'add_gateway_v1':
          return colors.purple100
        case 'payment_v1':
        case 'payment_v2':
          return isSending ? colors.blueBright : colors.greenMain
        case 'assert_location_v1':
          return colors.purpleMuted
        case 'rewards_v1':
          return colors.purpleBright
      }
    },
    [isSending, colors],
  )

  const icon = useCallback(
    (type: string) => {
      if (!TxnTypeKeys.find((k) => k === type)) {
        return null
      }

      const size = 24
      switch (type as TxnType) {
        case 'transfer_hotspot_v1':
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
    },
    [isSending],
  )

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
          style={{ backgroundColor: iconBackgroundColor(item.type) }}
          justifyContent="center"
          alignItems="center"
          borderTopLeftRadius={isFirst ? 'm' : undefined}
          borderBottomLeftRadius={isLast ? 'm' : undefined}
        >
          {icon(item.type)}
        </Box>
        <Box flex={1} paddingHorizontal="m">
          <Text
            variant="body2Medium"
            color="black"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {titles(item.type)}
          </Text>
          <Text
            color="grayExtraLight"
            variant="body2"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
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
