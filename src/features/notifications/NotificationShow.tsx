import React from 'react'
import { formatRelative, fromUnixTime } from 'date-fns'
import { Modal, Image, Share } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import Box from '../../components/Box'
import Card from '../../components/Card'
import HeliumNotification from '../../assets/images/heliumNotification.svg'
import Text from '../../components/Text'
import CloseModal from '../../assets/images/closeModal.svg'
import BlurBox from '../../components/BlurBox'
import TouchableOpacityBox from '../../components/TouchableOpacityBox'
import { useSpacing } from '../../theme/themeHooks'
import parseMarkup from '../../utils/parseMarkup'
import Button from '../../components/Button'
import { Notification } from '../../store/notifications/notificationSlice'

type Props = {
  notification: Notification | null
  onClose: () => void
}
const NotificationShow = ({ notification, onClose }: Props) => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const spacing = useSpacing()
  const navigation = useNavigation()

  const { body, title, time, footer, share_text: shareText } = notification || {
    body: '',
    title: '',
  }
  const dateText = time ? formatRelative(fromUnixTime(time), new Date()) : ''
  const isTransferRequest =
    notification?.style === 'transfer' &&
    notification?.title === 'Transfer Hotspot Request'

  const onViewTransferRequest = () => {
    onClose()
    navigation.navigate('SendStack', {
      hotspot: { address: notification?.hotspot_address },
      isSeller: false,
      type: 'transfer',
    })
  }

  return (
    <Modal
      presentationStyle="overFullScreen"
      transparent
      visible={!!notification}
      onRequestClose={onClose}
      animationType="fade"
    >
      <Box flex={1} justifyContent="flex-end" flexDirection="column">
        <BlurBox
          top={0}
          left={0}
          bottom={0}
          right={0}
          blurAmount={70}
          blurType="dark"
          position="absolute"
        />

        <Card
          variant="modal"
          padding="l"
          margin="m"
          style={{ marginTop: insets.top + spacing.xxl }}
        >
          <Box flexDirection="row" alignItems="center">
            <HeliumNotification />
            <Text variant="body2" color="purpleMain" marginLeft="xs" flex={1}>
              Helium Update
            </Text>
            <TouchableOpacityBox alignSelf="flex-start" onPress={onClose}>
              <CloseModal color="#CFD3ED" />
            </TouchableOpacityBox>
          </Box>
          <Text variant="h2" color="black" marginTop="lx" marginBottom="s">
            {title}
          </Text>
          <Text variant="body3" color="purpleMain" textTransform="uppercase">
            {dateText}
          </Text>
          <Box height={1} backgroundColor="grayLight" marginVertical="l" />
          {parseMarkup(body, <Text variant="body2" color="black" />)}

          {isTransferRequest ? (
            <Button
              title={t('transfer.notification_button')}
              mode="contained"
              paddingTop="l"
              onPress={onViewTransferRequest}
            />
          ) : null}

          {!!footer && (
            <Box marginTop="l">
              {parseMarkup(footer, <Text variant="body2" color="grayBlack" />)}
            </Box>
          )}

          {!!shareText && (
            <TouchableOpacityBox
              flexDirection="row"
              alignItems="center"
              paddingVertical="l"
              marginBottom="n_l"
              onPress={() => Share.share({ message: shareText })}
            >
              <Text variant="body2" color="grayDark" marginRight="s">
                {t('notifications.share')}
              </Text>
              <Image
                source={require('../../assets/images/notification-arrow-right.png')}
              />
            </TouchableOpacityBox>
          )}
        </Card>
      </Box>
    </Modal>
  )
}

export default NotificationShow
