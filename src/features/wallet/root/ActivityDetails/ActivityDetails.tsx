import { AnyTransaction, PendingTransaction } from '@helium/http'
import React, { ElementRef, useEffect, useRef } from 'react'
import { Animated, Modal } from 'react-native'
import BottomSheet from 'react-native-holy-sheet'
import { AnimatedBlurBox } from '../../../../components/BlurBox'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import ActivityDetailsHeader from './ActivityDetailsHeader'
import useActivityItem from '../useActivityItem'
import ActivityRewards from './ActivityRewards'

type Props = {
  item?: AnyTransaction | PendingTransaction
  address: string
  onClose: () => void
}

const ActivityDetails = ({ item, onClose, address }: Props) => {
  type BottomSheetHandle = ElementRef<typeof BottomSheet>
  const sheet = useRef<BottomSheetHandle>(null)
  const {
    backgroundColor,
    title,
    icon,
    amount,
    time,
    snapHeight,
    isFee,
  } = useActivityItem(address || '')

  const opacityAnim = useRef(new Animated.Value(0))

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
                date={time(item)}
              />
            )}
          >
            <Box padding="l">
              <Text
                variant="medium"
                fontSize={32}
                color={isFee(item) ? 'blueMain' : 'greenMain'}
                alignSelf="flex-end"
                marginBottom="lx"
              >
                {amount(item)}
              </Text>
              <ActivityRewards item={item} />
            </Box>
          </BottomSheet>
        </Box>
      )}
    </Modal>
  )
}

export default ActivityDetails
