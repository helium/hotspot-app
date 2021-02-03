import { PaymentV1 } from '@helium/http'
import React, { useEffect, useRef, useCallback, memo } from 'react'
import { Linking } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import { useTranslation } from 'react-i18next'
import { useAsync } from 'react-async-hook'
import LinkImg from '@assets/images/link.svg'
import { useSelector } from 'react-redux'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import ActivityDetailsHeader from './ActivityDetailsHeader'
import useActivityItem from '../useActivityItem'
import Rewards from './Rewards'
import HotspotTransaction from './HotspotTransaction'
import Payment from './Payment'
import Burn from './Burn'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import { getSecureItem } from '../../../../utils/secureAccount'
import UnknownTransaction from './UnknownTransaction'
import { RootState } from '../../../../store/rootReducer'
import { useAppDispatch } from '../../../../store/store'
import activitySlice from '../../../../store/activity/activitySlice'

const DF = 'MM/dd/yyyy hh:mm a'
const ActivityDetails = () => {
  const sheet = useRef<BottomSheetModal>(null)
  const { result: address } = useAsync(getSecureItem, ['address'])
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const {
    activity: { detailTxn },
  } = useSelector((state: RootState) => state)
  const {
    backgroundColor,
    backgroundColorKey,
    title,
    detailIcon,
    amount,
    time,
    isFee,
    fee,
  } = useActivityItem(address || '')

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

  const onClose = () => {
    dispatch(activitySlice.actions.clearDetailTxn())
  }

  const renderHandle = useCallback(() => {
    if (!detailTxn) return null
    return (
      <ActivityDetailsHeader
        backgroundColor={backgroundColor(detailTxn)}
        icon={detailIcon(detailTxn)}
        title={title(detailTxn)}
        date={time(detailTxn, DF)}
      />
    )
  }, [detailTxn, detailIcon, title, time, backgroundColor])

  if (!detailTxn) return null

  const feeStr = fee(detailTxn)

  return (
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
            fontSize={32}
            numberOfLines={1}
            adjustsFontSizeToFit
            color={isFee(detailTxn) ? 'blueMain' : 'greenMain'}
            alignSelf="flex-end"
            marginBottom={!feeStr ? 'm' : 'none'}
          >
            {amount(detailTxn)}
          </Text>

          {!!feeStr && (
            <Text
              variant="light"
              fontSize={15}
              color="blueBright"
              alignSelf="flex-end"
              marginBottom="m"
            >
              {`${feeStr} ${t('generic.fee')}`}
            </Text>
          )}
          <Rewards item={detailTxn} />
          <Payment item={detailTxn} address={address || ''} />
          <Burn item={detailTxn} address={address || ''} />
          <HotspotTransaction item={detailTxn} address={address || ''} />
          <UnknownTransaction item={detailTxn} />
          {block && (
            <TouchableOpacityBox
              backgroundColor={backgroundColorKey(detailTxn)}
              height={63}
              width="100%"
              borderRadius="ms"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              onPress={() => {
                Linking.openURL(
                  `https://explorer.helium.com/blocks/${block?.toString()}`,
                )
              }}
            >
              <Text
                variant="medium"
                fontSize={16}
                color="white"
                marginRight="s"
              >
                {`${t(
                  'activity_details.view_block',
                )} ${block?.toLocaleString()}`}
              </Text>
              <LinkImg />
            </TouchableOpacityBox>
          )}
        </Box>
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
}

export default memo(ActivityDetails)
