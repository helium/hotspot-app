import React, { useState, memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import CircleLoader from '../../../components/CircleLoader'
import Text from '../../../components/Text'
import TextInput from '../../../components/TextInput'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import useAlert from '../../../utils/useAlert'
import useKeyboardHeight from '../../../utils/useKeyboardHeight'

type Props = { network: string; onFinished: () => void }
const WifiSetup = ({ network, onFinished }: Props) => {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const { t } = useTranslation()
  const keyboardHeight = useKeyboardHeight()
  const { setWifiCredentials } = useConnectedHotspotContext()
  const { showOKAlert } = useAlert()

  const handleSetWifi = useCallback(async () => {
    setLoading(true)
    setWifiCredentials(network, password, async (response) => {
      if (response === 'connected') {
        onFinished()
        return
      }

      setLoading(false)

      if (response === 'error') {
        showOKAlert({ titleKey: 'something went wrong' })
      } else if (response === 'invalid') {
        showOKAlert({ titleKey: 'Your password is invalid' })
      }
    })
  }, [network, onFinished, password, setWifiCredentials, showOKAlert])

  const toggleSecureEntry = useCallback(() => {
    setSecureTextEntry(!secureTextEntry)
  }, [secureTextEntry])

  return (
    <Box padding="l">
      <Box flexDirection="row" justifyContent="space-between">
        <Text variant="h4" color="black">
          {network}
        </Text>
        {loading && <CircleLoader loaderSize={24} />}
      </Box>
      <TextInput
        marginVertical="lx"
        editable={!loading}
        padding="m"
        variant="light"
        placeholder={t('hotspot_setup.wifi_password.placeholder')}
        onChangeText={setPassword}
        value={password}
        keyboardAppearance="dark"
        autoCorrect={false}
        autoCompleteType="off"
        autoCapitalize="none"
        blurOnSubmit={false}
        returnKeyType="join"
        secureTextEntry={secureTextEntry}
        autoFocus
        onSubmitEditing={handleSetWifi}
      />
      <Button
        onPress={handleSetWifi}
        disabled={loading}
        variant="primary"
        mode="contained"
        title={t('generic.connect')}
      />
      <Button
        onPress={toggleSecureEntry}
        variant="primary"
        mode="text"
        title={
          secureTextEntry
            ? t('hotspot_settings.wifi.show_password')
            : t('hotspot_settings.wifi.hide_password')
        }
      />
      {Platform.OS === 'ios' && <Box height={keyboardHeight} />}
    </Box>
  )
}

export default memo(WifiSetup)
