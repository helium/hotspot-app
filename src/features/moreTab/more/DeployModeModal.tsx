import React, { useCallback, useState, useEffect } from 'react'
import { BoxProps } from '@shopify/restyle'
import { Address } from '@helium/crypto-react-native'
import { StyleSheet, StyleProp, View, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import DeployModeIcon from '@assets/images/deployModeIcon.svg'
import { Theme } from '../../../theme/theme'
import appSlice from '../../../store/user/appSlice'
import { useAppDispatch } from '../../../store/store'
import Text from '../../../components/Text'
import Box from '../../../components/Box'
import Bullet from '../../../components/Bullet'
import HeliumBottomSheet from '../../../components/HeliumBottomSheet'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import InputField from '../../../components/InputField'
import useKeyboardHeight from '../../../utils/useKeyboardHeight'
import { useColors } from '../../../theme/themeHooks'

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
      marginVertical="xs"
      alignItems="center"
      justifyContent="center"
      borderRadius="ms"
      width="100%"
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

const DeployModeModal = ({ isVisible, onClose = () => {} }: Props) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const insets = useSafeAreaInsets()
  const keyboardHeight = useKeyboardHeight()
  const colors = useColors()
  const [sendAddress, setSendAddress] = useState('')

  const sheetHeight = 700 + (insets?.bottom || 0) + keyboardHeight
  const enableDeployMode = useCallback(() => {
    dispatch(appSlice.actions.enableDeployMode(true))
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
      hideHeaderBorder
    >
      <DeployModeIcon />
      <Text variant="h2" marginTop="l" maxFontSizeMultiplier={1} color="black">
        {t('more.sections.security.deployMode.title')}
      </Text>
      <Text
        variant="body1"
        paddingTop="m"
        maxFontSizeMultiplier={1}
        color="purpleText"
        style={{ fontSize: 18 }}
      >
        {t('more.sections.security.deployMode.subtitle')}
      </Text>
      <Text variant="bold" marginTop="l" color="purpleLightText">
        {t('more.sections.security.deployMode.inDeployMode')}
      </Text>
      <Box marginTop="m">
        <Bullet color={colors.purpleLightText} style={styles.bullet}>
          <Text variant="body2" color="purpleLightText">
            {t('more.sections.security.deployMode.cantViewWords')}
          </Text>
        </Bullet>
        <Bullet color={colors.purpleLightText} style={styles.bullet}>
          <Text variant="body2" color="purpleLightText" marginBottom="none">
            {t('more.sections.security.deployMode.cantTransferHotspots')}
          </Text>
        </Bullet>
        <Bullet color={colors.purpleLightText} style={styles.bullet}>
          <Text variant="body2" color="purpleLightText" marginBottom="none">
            {t('more.sections.security.deployMode.canOnlySendFunds')}{' '}
            <Text variant="bold" color="purpleLightText">
              {t('generic.one')}
            </Text>{' '}
            {t('more.sections.security.deployMode.otherAccount')}
          </Text>
        </Bullet>
      </Box>
      <Text variant="bold" marginTop="m" color="redMedium">
        {t('more.sections.security.deployMode.disableInstructions')}
      </Text>
      <Box marginBottom="xl" style={styles.footerContainer}>
        <InputField
          onChange={setSendAddress}
          placeholder={t('more.sections.security.deployMode.addressLabel')}
          isFirst
          isLast
          optional
        />
        <ActionButton onPress={enableDeployMode} style={confirmationStyle}>
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
  bullet: { marginBottom: 0 },
  cancelContainer: { backgroundColor: '#F0F0F5' },
  cancelText: { color: '#B3B4D6' },
  confirmContainer: { backgroundColor: '#F97570' },
  confirmContainerDisabled: { backgroundColor: 'rgba(249, 117, 112, 0.5)' },
  confirmText: { color: '#FFFFFF' },
  footerContainer: {
    marginTop: 'auto',
  },
})

export default DeployModeModal
