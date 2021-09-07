import React, { useMemo } from 'react'
import { formatRelative, fromUnixTime } from 'date-fns'
import { Modal, Image, Share, ScrollView, Platform } from 'react-native'
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
import { RootNavigationProp } from '../../navigation/main/tabTypes'

type Props = {
  notification: Notification | null
  onClose: () => void
}
const NotificationShow = ({ notification, onClose }: Props) => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const spacing = useSpacing()
  const navigation = useNavigation<RootNavigationProp>()

  const { body, title, time, footer, shareText } = notification || {
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
      hotspotAddress: notification?.hotspotAddress || undefined,
      isSeller: false,
      type: 'transfer',
    })
  }

  const containerStyle = useMemo(
    () => ({ marginTop: insets.top + spacing.l }),
    [insets.top, spacing.l],
  )

  const bodyStyle = useMemo(
    () => ({ maxHeight: Platform.select({ ios: 450, android: 350 }) }),
    [],
  )

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
        <TouchableOpacityBox flex={1} onPress={onClose} />
        <Card
          variant="modal"
          padding="l"
          margin="m"
          style={containerStyle}
          marginBottom="xl"
        >
          <Box flexDirection="row" alignItems="center">
            <HeliumNotification />
            <Text variant="body2" color="purpleMain" marginLeft="xs" flex={1}>
              {t('notifications.helium_update')}
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

          <ScrollView style={bodyStyle}>
            <>
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
                  {parseMarkup(
                    footer,
                    <Text variant="body2" color="grayBlack" />,
                  )}
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
            </>
          </ScrollView>
        </Card>
      </Box>
    </Modal>
  )
}

export default NotificationShow
