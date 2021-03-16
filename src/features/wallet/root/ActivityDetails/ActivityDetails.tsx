import { AnyTransaction, PaymentV1, PendingTransaction } from '@helium/http'
import React, { memo, useCallback, useEffect, useRef } from 'react'
import { Linking } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import { useTranslation } from 'react-i18next'
import { useAsync } from 'react-async-hook'
import LinkImg from '@assets/images/link.svg'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import ActivityDetailsHeader from './ActivityDetailsHeader'
import Rewards from './Rewards'
import HotspotTransaction from './HotspotTransaction'
import Payment from './Payment'
import Burn from './Burn'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import { getSecureItem } from '../../../../utils/secureAccount'
import UnknownTransaction from './UnknownTransaction'
import { useAppDispatch } from '../../../../store/store'
import activitySlice from '../../../../store/activity/activitySlice'
import { locale } from '../../../../utils/i18n'
import { EXPLORER_BASE_URL } from '../../../../utils/config'
import useCurrency from '../../../../utils/useCurrency'
import useActivityItem from '../useActivityItem'

const DF = 'MM/dd/yyyy hh:mm a'
type Props = { detailTxn: AnyTransaction | PendingTransaction }
const ActivityDetails = ({ detailTxn }: Props) => {
  const sheet = useRef<BottomSheetModal>(null)
  const { result: address } = useAsync(getSecureItem, ['address'])
  const { t } = useTranslation()
  const { toggleConvertHntToCurrency } = useCurrency()
  const dispatch = useAppDispatch()
  const txnDisplayVals = useActivityItem(detailTxn, address || '', DF)

  let block: number | undefined
  if (detailTxn) {
    const asPayment = detailTxn as PaymentV1
    block = asPayment.height
  }

  useEffect(() => {
    if (detailTxn) {
      sheet.current?.present()
    }
  }, [detailTxn])

  const onClose = useCallback(() => {
    dispatch(activitySlice.actions.clearDetailTxn())
  }, [dispatch])

  const renderHandle = useCallback(() => {
    if (!detailTxn) return null
    return (
      <ActivityDetailsHeader
        backgroundColor={txnDisplayVals.backgroundColor}
        icon={txnDisplayVals.detailIcon}
        title={txnDisplayVals.title}
        date={txnDisplayVals.time}
      />
    )
  }, [
    detailTxn,
    txnDisplayVals.backgroundColor,
    txnDisplayVals.detailIcon,
    txnDisplayVals.time,
    txnDisplayVals.title,
  ])

  const openExplorer = useCallback(
    () => Linking.openURL(`${EXPLORER_BASE_URL}/blocks/${block?.toString()}`),
    [block],
  )

  if (!detailTxn) return null

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={sheet}
        snapPoints={['50%', '75%']}
        handleComponent={renderHandle}
        backdropComponent={BottomSheetBackdrop}
        onDismiss={onClose}
      >
        <BottomSheetScrollView>
          <Box padding="l" flex={1}>
            <Text
              variant="medium"
              onPress={toggleConvertHntToCurrency}
              fontSize={32}
              numberOfLines={1}
              adjustsFontSizeToFit
              color={txnDisplayVals.isFee ? 'blueMain' : 'greenMain'}
              alignSelf="flex-end"
              marginBottom={!txnDisplayVals.fee ? 'm' : 'none'}
            >
              {txnDisplayVals.amount}
            </Text>

            {!!txnDisplayVals.fee && (
              <Text
                variant="light"
                fontSize={15}
                color="blueBright"
                alignSelf="flex-end"
                marginBottom={!txnDisplayVals.feePayer ? 'm' : 'none'}
              >
                {`${txnDisplayVals.fee} ${t('generic.fee')}`}
              </Text>
            )}

            {!!txnDisplayVals.feePayer && (
              <Text
                variant="light"
                fontSize={15}
                color="graySteel"
                marginTop="xs"
                marginBottom="s"
                alignSelf="flex-end"
              >
                {t('activity_details.staking_fee_payer', {
                  payer: txnDisplayVals.feePayer,
                })}
              </Text>
            )}

            <Rewards item={detailTxn} />
            <Payment item={detailTxn} address={address || ''} />
            <Burn item={detailTxn} address={address || ''} />
            <HotspotTransaction item={detailTxn} address={address || ''} />
            <UnknownTransaction item={detailTxn} />
            {block && (
              <TouchableOpacityBox
                backgroundColor={txnDisplayVals.backgroundColorKey}
                height={63}
                width="100%"
                borderRadius="ms"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                onPress={openExplorer}
              >
                <Text
                  variant="medium"
                  fontSize={16}
                  color="white"
                  marginRight="s"
                >
                  {`${t('activity_details.view_block')} ${block?.toLocaleString(
                    locale,
                  )}`}
                </Text>
                <LinkImg />
              </TouchableOpacityBox>
            )}
          </Box>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  )
}

export default memo(ActivityDetails)
