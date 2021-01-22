import { AnyTransaction, PendingTransaction } from '@helium/http'
import React, { ElementRef, useEffect, useRef } from 'react'
import { Modal } from 'react-native'
import BottomSheet from 'react-native-holy-sheet'
import BlurBox from '../../../components/BlurBox'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import ActivityDetailsHeader from './ActivityDetailsHeader'
import useActivityItem from './useActivityItem'

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
          <BlurBox
            top={0}
            left={0}
            bottom={0}
            right={0}
            tint="dark"
            position="absolute"
            intensity={80}
            onTouchStart={onClose}
          />
          <BottomSheet
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
              >
                {amount(item)}
              </Text>
            </Box>
          </BottomSheet>
        </Box>
      )}
    </Modal>
  )
}

export default ActivityDetails
