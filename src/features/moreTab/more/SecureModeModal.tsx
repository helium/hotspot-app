import React, { useCallback } from 'react'
import { BoxProps } from '@shopify/restyle'
import { StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Font, Theme } from '../../../theme/theme'
import appSlice from '../../../store/user/appSlice'
import { useAppDispatch } from '../../../store/store'
import Text from '../../../components/Text'
import Box from '../../../components/Box'
import HeliumBottomSheet from '../../../components/HeliumBottomSheet'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'

type ActionButtonProps = {
  children: React.ReactNode
  onPress: () => void
  style?: StyleProp<ViewStyle>
}
const ActionButton = ({ children, onPress, style = {} }: ActionButtonProps) => {
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

  const sheetHeight = 236 + (insets?.bottom || 0)
  const enableSecureMode = useCallback(() => {
    dispatch(appSlice.actions.enableSecureMode(true))
    onClose()
  }, [dispatch, onClose])

  return (
    <HeliumBottomSheet
      isVisible={isVisible}
      onClose={onClose}
      sheetHeight={sheetHeight}
      title={t('more.sections.security.secureMode.title')}
    >
      <Text>{t('more.sections.security.secureMode.description')}</Text>
      <Text marginTop="m" fontFamily={Font.main.semiBold}>
        {t('more.sections.security.secureMode.warning')}
      </Text>
      <Box marginBottom="xl" style={styles.footerContainer}>
        <ActionButton onPress={onClose} style={styles.cancelContainer}>
          <Text variant="medium" fontSize={18} style={styles.cancelText}>
            {t('generic.cancel')}
          </Text>
        </ActionButton>
        <ActionButton
          onPress={enableSecureMode}
          style={styles.confirmContainer}
        >
          <Text variant="medium" fontSize={18} style={styles.confirmText}>
            {t('generic.submit')}
          </Text>
        </ActionButton>
      </Box>
    </HeliumBottomSheet>
  )
}

const styles = StyleSheet.create({
  cancelContainer: { backgroundColor: '#F0F0F5' },
  cancelText: { color: '#B3B4D6' },
  confirmContainer: { backgroundColor: '#F97570' },
  confirmText: { color: '#FFFFFF' },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default SecureModeModal
