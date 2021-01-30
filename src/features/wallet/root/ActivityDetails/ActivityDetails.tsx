import { PaymentV1 } from '@helium/http'
import React, { ElementRef, useEffect, useRef, memo, useCallback } from 'react'
import { Linking } from 'react-native'
import BottomSheet from 'react-native-holy-sheet'
import { useTranslation } from 'react-i18next'
import {
  useDerivedValue,
  useSharedValue,
  interpolate,
  Extrapolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { useAsync } from 'react-async-hook'
import { ReAnimatedBlurBox } from '../../../../components/BlurBox'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import ActivityDetailsHeader from './ActivityDetailsHeader'
import useActivityItem from '../useActivityItem'
import Rewards from './Rewards'
import HotspotTransaction from './HotspotTransaction'
import Payment from './Payment'
import Burn from './Burn'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import LinkImg from '../../../../assets/images/link.svg'
import { useWalletContext } from './WalletProvider'
import { getSecureItem } from '../../../../utils/secureAccount'
import animateTransition from '../../../../utils/animateTransition'
import UnknownTransaction from './UnknownTransaction'

const DF = 'MM/dd/yyyy hh:mm a'
const ActivityDetails = () => {
  type BottomSheetHandle = ElementRef<typeof BottomSheet>
  const sheet = useRef<BottomSheetHandle>(null)
  const { result: address } = useAsync(getSecureItem, ['address'])
  const { t } = useTranslation()
  const { activityItem, setActivityItem } = useWalletContext()
  const {
    backgroundColor,
    backgroundColorKey,
    title,
    detailIcon,
    amount,
    time,
    snapHeight,
    isFee,
    fee,
  } = useActivityItem(address || '')

  let block: number | undefined
  if (activityItem) {
    const asPayment = activityItem as PaymentV1
    block = asPayment.height
  }

  useEffect(() => {
    if (activityItem) {
      const snap = async () => {
        sheet.current?.snapTo(2)
      }
      snap()
    }
  }, [activityItem])

  const onClose = () => {
    setActivityItem(null)
  }

  const dragMax = activityItem ? snapHeight(activityItem) : 100
  const dragMin = 0
  const snapPoints = [dragMin, dragMax]
  const snapProgress = useSharedValue(0)

  const opacity = useDerivedValue(() => {
    return interpolate(snapProgress.value, [1, 0], [1, 0.5], Extrapolate.CLAMP)
  })
  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const handleClose = useCallback(() => {
    sheet.current?.snapTo(0)
  }, [])

  if (!activityItem) return null

  const feeStr = fee(activityItem)

  return (
    <Box
      flex={1}
      justifyContent="flex-end"
      flexDirection="column"
      position="absolute"
      top={activityItem ? 0 : -1000}
      left={0}
      bottom={activityItem ? 0 : 1000}
      right={0}
      zIndex={1000}
    >
      <ReAnimatedBlurBox
        style={animatedStyles}
        top={0}
        bottom={0}
        right={0}
        left={0}
        tint="dark"
        position="absolute"
        intensity={90}
        onTouchStart={handleClose}
      />
      <BottomSheet
        snapProgress={snapProgress}
        containerStyle={{ paddingHorizontal: 0 }}
        ref={sheet}
        snapPoints={snapPoints}
        initialSnapIndex={0}
        onCloseStart={() => {
          animateTransition()
          onClose()
        }}
        renderHeader={() => (
          <ActivityDetailsHeader
            backgroundColor={backgroundColor(activityItem)}
            icon={detailIcon(activityItem)}
            title={title(activityItem)}
            date={time(activityItem, DF)}
          />
        )}
      >
        <Box padding="l" flex={1} style={{ paddingBottom: 500 }}>
          <Text
            variant="medium"
            fontSize={32}
            numberOfLines={1}
            adjustsFontSizeToFit
            color={isFee(activityItem) ? 'blueMain' : 'greenMain'}
            alignSelf="flex-end"
            marginBottom={!feeStr ? 'm' : 'none'}
          >
            {amount(activityItem)}
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
          <Rewards item={activityItem} />
          <Payment item={activityItem} address={address || ''} />
          <Burn item={activityItem} address={address || ''} />
          <HotspotTransaction item={activityItem} address={address || ''} />
          <UnknownTransaction item={activityItem} />
          <TouchableOpacityBox
            backgroundColor={backgroundColorKey(activityItem)}
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
            <Text variant="medium" fontSize={16} color="white" marginRight="s">
              {`${t('activity_details.view_block')} ${block?.toLocaleString()}`}
            </Text>
            <LinkImg />
          </TouchableOpacityBox>
        </Box>
      </BottomSheet>
    </Box>
  )
}

export default memo(ActivityDetails)
