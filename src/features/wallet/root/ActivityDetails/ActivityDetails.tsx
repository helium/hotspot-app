/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, useCallback, useEffect, useRef, useMemo } from 'react'
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
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import { getSecureItem } from '../../../../utils/secureAccount'
import { useAppDispatch } from '../../../../store/store'
import activitySlice, {
  HttpPendingTransaction,
  HttpTransaction,
} from '../../../../store/activity/activitySlice'
import { locale } from '../../../../utils/i18n'
import { EXPLORER_BASE_URL } from '../../../../utils/config'
import useCurrency from '../../../../utils/useCurrency'
import useActivityItem, { isPendingTransaction } from '../useActivityItem'
import Rewards from './Rewards'
import StakeValidator from './StakeValidator'
import HotspotTransaction from './HotspotTransaction'
import Payment from './Payment'
import Burn from './Burn'
import UnknownTransaction from './UnknownTransaction'
import UnstakeValidator from './UnstakeValidator'
import TransferValidator from './TransferStake'

const DF = 'MM/dd/yyyy hh:mm a'
type Props = { detailTxn: HttpTransaction | HttpPendingTransaction }
const ActivityDetails = ({ detailTxn }: Props) => {
  const sheet = useRef<BottomSheetModal>(null)
  const { result: address } = useAsync(getSecureItem, ['address'])
  const { t } = useTranslation()
  const { toggleConvertHntToCurrency } = useCurrency()
  const dispatch = useAppDispatch()
  const txnDisplayVals = useActivityItem(detailTxn, address || '', DF)

  const txn = useMemo(() => {
    if (isPendingTransaction(detailTxn)) {
      return detailTxn.txn
    }
    return detailTxn
  }, [detailTxn])

  const block = useMemo(() => txn.height, [txn.height])

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
        hash={txnDisplayVals.hash}
      />
    )
  }, [
    detailTxn,
    txnDisplayVals.backgroundColor,
    txnDisplayVals.detailIcon,
    txnDisplayVals.hash,
    txnDisplayVals.time,
    txnDisplayVals.title,
  ])

  const openExplorer = useCallback(
    () => Linking.openURL(`${EXPLORER_BASE_URL}/blocks/${block?.toString()}`),
    [block],
  )

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  )

  const snapPoints = useMemo(() => ['65%', '90%'], [])
  if (!detailTxn) return null

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={sheet}
        snapPoints={snapPoints}
        handleComponent={renderHandle}
        backdropComponent={renderBackdrop}
        onDismiss={onClose}
      >
        <BottomSheetScrollView>
          <Box padding="l" flex={1}>
            {!!txnDisplayVals.amount && (
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
            )}

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

            <StakeValidator item={txn} />
            <UnstakeValidator item={txn} />
            <TransferValidator item={txn} address={address || ''} />
            <Rewards item={txn} />
            <Payment item={txn} address={address || ''} />
            <Burn item={txn} address={address || ''} />
            <HotspotTransaction item={txn} address={address || ''} />
            <UnknownTransaction item={txn} />
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
