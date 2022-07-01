import React, { useCallback, useState, useEffect } from 'react'
import { BoxProps } from '@shopify/restyle'
import { KeyboardAvoidingView, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import DeployModeIcon from '@assets/images/deployModeIcon.svg'
import Address from '@helium/address'
import { Theme } from '../../../theme/theme'
import appSlice from '../../../store/user/appSlice'
import { useAppDispatch } from '../../../store/store'
import Text from '../../../components/Text'
import Box from '../../../components/Box'
import Bullet from '../../../components/Bullet'
import HeliumBottomSheet from '../../../components/HeliumBottomSheet'
import InputField from '../../../components/InputField'
import { useColors } from '../../../theme/themeHooks'
import SwipeButton from '../../../components/SwipeButton'

type Props = BoxProps<Theme> & {
  isVisible: boolean
  onClose?: () => void
}

const DeployModeModal = ({ isVisible, onClose = () => {} }: Props) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const insets = useSafeAreaInsets()
  const colors = useColors()
  const [sendAddress, setSendAddress] = useState('')

  const sheetHeight = 700 + (insets?.bottom || 0)
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
  return (
    <HeliumBottomSheet
      isVisible={isVisible}
      onClose={onClose}
      sheetHeight={sheetHeight}
      hideHeaderBorder
    >
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={100}
        style={{ flexGrow: 1, marginTop: 'auto' }}
      >
        <DeployModeIcon />
        <Text
          variant="h2"
          marginTop="l"
          maxFontSizeMultiplier={1}
          color="black"
        >
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
        <Box marginVertical="xl">
          <InputField
            onChange={setSendAddress}
            placeholder={t('more.sections.security.deployMode.addressLabel')}
            isFirst
            isLast
            optional
          />
          <SwipeButton
            disabled={!isValid}
            onSwipeSuccess={enableDeployMode}
            onSwipeSuccessDelay={1000}
          />
        </Box>
      </KeyboardAvoidingView>
    </HeliumBottomSheet>
  )
}

const styles = StyleSheet.create({
  bullet: { marginBottom: 0 },
  cancelContainer: { backgroundColor: '#F0F0F5' },
  cancelText: { color: '#B3B4D6' },
  confirmText: { color: '#FFFFFF' },
})

export default DeployModeModal
