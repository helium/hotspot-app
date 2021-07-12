import React, { useCallback, useState, useEffect } from 'react'
import { BoxProps } from '@shopify/restyle'
import { Address } from '@helium/crypto-react-native'
import { StyleSheet, StyleProp, View, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Font, Theme } from '../../../theme/theme'
import appSlice from '../../../store/user/appSlice'
import { useAppDispatch } from '../../../store/store'
import Text from '../../../components/Text'
import Box from '../../../components/Box'
import HeliumBottomSheet from '../../../components/HeliumBottomSheet'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import InputField from '../../../components/InputField'
import Check from '../../../assets/images/check.svg'
import useKeyboardHeight from '../../../utils/useKeyboardHeight'

type ActionButtonProps = {
  children: React.ReactNode
  disabled?: boolean
  onPress: () => void
  style?: StyleProp<ViewStyle>
}
const ActionButton = ({
  children,
  disabled,
  onPress,
  style = {},
}: ActionButtonProps) => {
  return (
    <TouchableOpacityBox
      height={49}
      marginVertical="m"
      alignItems="center"
      justifyContent="center"
      borderRadius="ms"
      width="48%"
      onPress={onPress}
      style={style}
      disabled={disabled}
    >
      {children}
    </TouchableOpacityBox>
  )
}

type Props = BoxProps<Theme> & {
  isVisible: boolean
  onClose?: () => void
}

const SecureModeModal = ({ isVisible, onClose = () => {} }: Props) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const insets = useSafeAreaInsets()
  const keyboardHeight = useKeyboardHeight()
  const [sendAddress, setSendAddress] = useState('')

  const sheetHeight = 400 + (insets?.bottom || 0) + keyboardHeight
  const enableSecureMode = useCallback(() => {
    dispatch(appSlice.actions.enableSecureMode(true))
    if (sendAddress) {
      dispatch(appSlice.actions.setPermanentPaymentAddress(sendAddress))
    }
    onClose()
  }, [dispatch, sendAddress, onClose])

  useEffect(() => {
    if (!isVisible) setSendAddress('')
  }, [isVisible])

  // Only disable "Submit" if an address is provided but is invalid
  const isValid = sendAddress ? Address.isValid(sendAddress) : true
  const confirmationStyle = isValid
    ? styles.confirmContainer
    : styles.confirmContainerDisabled
  return (
    <HeliumBottomSheet
      isVisible={isVisible}
      onClose={onClose}
      sheetHeight={sheetHeight}
      title={t('more.sections.security.secureMode.title')}
    >
      <Text>{t('more.sections.security.secureMode.description')}</Text>
      <Text marginVertical="m" fontFamily={Font.main.semiBold}>
        {t('more.sections.security.secureMode.warning')}
      </Text>
      <InputField
        onChange={setSendAddress}
        label={t('more.sections.security.secureMode.addressLabel')}
        placeholder={t('send.address.placeholder')}
        extra={
          sendAddress && isValid ? (
            <Box padding="s" position="absolute" right={0}>
              <Check />
            </Box>
          ) : undefined
        }
      />
      <Box marginBottom="xl" style={styles.footerContainer}>
        <ActionButton onPress={onClose} style={styles.cancelContainer}>
          <Text variant="medium" fontSize={18} style={styles.cancelText}>
            {t('generic.cancel')}
          </Text>
        </ActionButton>
        <ActionButton onPress={enableSecureMode} style={confirmationStyle}>
          <Text variant="medium" fontSize={18} style={styles.confirmText}>
            {t('generic.submit')}
          </Text>
        </ActionButton>
      </Box>
      <View style={{ height: keyboardHeight }} />
    </HeliumBottomSheet>
  )
}

const styles = StyleSheet.create({
  cancelContainer: { backgroundColor: '#F0F0F5' },
  cancelText: { color: '#B3B4D6' },
  confirmContainer: { backgroundColor: '#F97570' },
  confirmContainerDisabled: { backgroundColor: 'rgba(249, 117, 112, 0.5)' },
  confirmText: { color: '#FFFFFF' },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default SecureModeModal
