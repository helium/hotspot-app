import { AnyTransaction, PendingTransaction, PaymentV1 } from '@helium/http'
import React, { ElementRef, useEffect, useRef } from 'react'
import { Animated, Linking, Modal } from 'react-native'
import BottomSheet from 'react-native-holy-sheet'
import { useTranslation } from 'react-i18next'
import {
  useDerivedValue,
  useSharedValue,
  interpolate,
  Extrapolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { ReAnimatedBlurBox } from '../../../../components/BlurBox'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import ActivityDetailsHeader from './ActivityDetailsHeader'
import useActivityItem from '../useActivityItem'
import Rewards from './Rewards'
import Payment from './Payment'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import LinkImg from '../../../../assets/images/link.svg'
import sleep from '../../../../utils/sleep'

type Props = {
  item?: AnyTransaction | PendingTransaction
  address: string
  onClose: () => void
}

const DF = 'MM/dd/yyyy hh:mm a'
const ActivityDetails = ({ item, onClose, address }: Props) => {
  type BottomSheetHandle = ElementRef<typeof BottomSheet>
  const sheet = useRef<BottomSheetHandle>(null)
  const { t } = useTranslation()
  const {
    backgroundColor,
    backgroundColorKey,
    title,
    icon,
    amount,
    time,
    snapHeight,
    isFee,
  } = useActivityItem(address || '')

  const opacityAnim = useRef(new Animated.Value(0))
  let block = ''
  if (item) {
    const asPayment = item as PaymentV1
    block = asPayment.height?.toString() || ''
  }

  const anim = () => {
    if (!item) return

    Animated.timing(opacityAnim.current, {
      duration: 200,
      toValue: 90,
      useNativeDriver: false,
    }).start()
  }

  useEffect(() => {
    anim()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item])

  useEffect(() => {
    if (item) {
      const snap = async () => {
        await sleep(300)
        sheet.current?.snapTo(2)
      }
      snap()
    }
  }, [item])

  const dragMax = item ? snapHeight(item) : 100
  const dragMid = 143
  const dragMin = 0
  const snapPoints = [dragMin, dragMid, dragMax]
  const snapProgress = useSharedValue(dragMax)

  const intensity = useDerivedValue(() => {
    return interpolate(snapProgress.value, [1, 0], [1, 0], Extrapolate.CLAMP)
  })
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: intensity.value,
    }
  })

  return (
    <Modal
      presentationStyle="overFullScreen"
      transparent
      visible={!!item}
      onRequestClose={onClose}
    >
      {item && (
        <Box flex={1} justifyContent="flex-end" flexDirection="column">
          <ReAnimatedBlurBox
            top={0}
            left={0}
            bottom={0}
            style={animatedStyles}
            right={0}
            tint="dark"
            position="absolute"
            intensity={85}
            onTouchStart={onClose}
          />
          <BottomSheet
            snapProgress={snapProgress}
            containerStyle={{ paddingHorizontal: 0 }}
            ref={sheet}
            snapPoints={snapPoints}
            initialSnapIndex={0}
            onClose={onClose}
            renderHeader={() => (
              <ActivityDetailsHeader
                backgroundColor={backgroundColor(item)}
                icon={icon(item)}
                title={title(item)}
                date={time(item, DF)}
              />
            )}
          >
            <Box padding="l" flex={1}>
              <Text
                variant="medium"
                fontSize={32}
                color={isFee(item) ? 'blueMain' : 'greenMain'}
                alignSelf="flex-end"
              >
                {amount(item)}
              </Text>
              <Rewards item={item} />
              <Payment item={item} address={address} />
              <TouchableOpacityBox
                backgroundColor={backgroundColorKey(item)}
                height={63}
                width="100%"
                borderRadius="ms"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                onPress={() => {
                  Linking.openURL(`https://explorer.helium.com/blocks/${block}`)
                }}
              >
                <Text
                  variant="medium"
                  fontSize={16}
                  color="white"
                  marginRight="s"
                >
                  {`${t('activity_details.view_block')} ${block}`}
                </Text>
                <LinkImg />
              </TouchableOpacityBox>
            </Box>
          </BottomSheet>
        </Box>
      )}
    </Modal>
  )
}

export default ActivityDetails
