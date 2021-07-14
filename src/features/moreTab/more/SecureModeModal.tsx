import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { BoxProps } from '@shopify/restyle'
import { Address } from '@helium/crypto-react-native'
import { Modal, KeyboardAvoidingView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Theme } from '../../../theme/theme'
import appSlice from '../../../store/user/appSlice'
import { useAppDispatch } from '../../../store/store'
import Text from '../../../components/Text'
import CloseModal from '../../../assets/images/closeModal.svg'
import Box from '../../../components/Box'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Lock from '../../../assets/images/helium-hotspot.svg'
import Button from '../../../components/Button'
import TextInput from '../../../components/TextInput'
import { useColors } from '../../../theme/themeHooks'
import BlurBox from '../../../components/BlurBox'

type Props = BoxProps<Theme> & {
  isVisible: boolean
  onClose?: () => void
}

const SecureModeModal = ({ isVisible, onClose = () => {} }: Props) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const colors = useColors()
  const [sendAddress, setSendAddress] = useState('')

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
  // TODO: Disable for self
  const isValid = useMemo(
    () => (sendAddress ? Address.isValid(sendAddress) : true),
    [sendAddress],
  )

  const handleSendAddressChanged = useCallback(
    (text: string) => setSendAddress(text),
    [],
  )

  return (
    <Modal
      presentationStyle="overFullScreen"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <BlurBox
        top={0}
        left={0}
        bottom={0}
        right={0}
        blurAmount={70}
        blurType="dark"
        position="absolute"
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <TouchableOpacityBox flex={1} onPress={onClose} />
        <Box
          backgroundColor="greenMain"
          borderTopRightRadius="l"
          borderTopLeftRadius="l"
          padding="l"
          alignItems="center"
          flexDirection="row"
        >
          {/* TODO: Get the real icon */}
          <Lock />
          <Text variant="bold" fontSize={27} maxFontSizeMultiplier={1}>
            {t('more.sections.security.secureMode.title')}
          </Text>
          <Box flex={1} />
          <TouchableOpacityBox onPress={onClose}>
            <CloseModal color={colors.blackTransparent} />
          </TouchableOpacityBox>
        </Box>
        <Box padding="l" backgroundColor="white">
          <Text
            variant="body2"
            color="black"
            marginBottom="l"
            maxFontSizeMultiplier={1.2}
          >
            {t('more.sections.security.secureMode.description')}
          </Text>
          <TextInput
            variant="medium"
            placeholder={t('more.sections.security.secureMode.addressLabel')}
            onChangeText={handleSendAddressChanged}
            value={sendAddress}
            returnKeyType="done"
            autoCapitalize="none"
            autoFocus
            autoCorrect={false}
            autoCompleteType="off"
          />
          <Button
            title={t('generic.submit')}
            mode="contained"
            variant="secondary"
            paddingTop="m"
            onPress={enableSecureMode}
            disabled={!isValid}
          />
        </Box>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default SecureModeModal
