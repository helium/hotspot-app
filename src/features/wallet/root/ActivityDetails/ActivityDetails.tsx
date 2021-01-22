import { AnyTransaction, PendingTransaction, PaymentV1 } from '@helium/http'
import React, { ElementRef, useEffect, useRef } from 'react'
import { Animated, Linking, Modal } from 'react-native'
import BottomSheet from 'react-native-holy-sheet'
import { useTranslation } from 'react-i18next'
import { AnimatedBlurBox } from '../../../../components/BlurBox'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import ActivityDetailsHeader from './ActivityDetailsHeader'
import useActivityItem from '../useActivityItem'
import Rewards from './Rewards'
import Payment from './Payment'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import LinkImg from '../../../../assets/images/link.svg'

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
      duration: 300,
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
      sheet.current?.snapTo(1)
    }
  }, [item])

  return (
    <Modal
      presentationStyle="overFullScreen"
      transparent
      visible={!!item}
      onRequestClose={onClose}
      animationType="fade"
    >
      {item && (
        <Box flex={1} justifyContent="flex-end" flexDirection="column">
          <AnimatedBlurBox
            top={0}
            left={0}
            bottom={0}
            right={0}
            tint="dark"
            position="absolute"
            intensity={opacityAnim.current}
            onTouchStart={onClose}
          />
          <BottomSheet
            containerStyle={{ paddingHorizontal: 0 }}
            ref={sheet}
            snapPoints={[0, snapHeight(item)]}
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
