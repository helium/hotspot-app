import React, { useState } from 'react'
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

  const handleSetWifi = async () => {
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
  }

  return (
    <Box padding="l">
      <Text variant="h4" color="black">
        {network}
      </Text>
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
        returnKeyType="next"
        secureTextEntry={secureTextEntry}
        autoFocus
      />
      <Button
        onPress={handleSetWifi}
        disabled={loading}
        variant="primary"
        mode="contained"
        title={t('generic.connect')}
      />
      <Button
        onPress={() => setSecureTextEntry(!secureTextEntry)}
        variant="primary"
        mode="text"
        title={
          secureTextEntry
            ? t('hotspot_settings.wifi.show_password')
            : t('hotspot_settings.wifi.hide_password')
        }
      />
      {Platform.OS === 'ios' && <Box height={keyboardHeight} />}
      {loading && <CircleLoader marginTop="l" />}
    </Box>
  )
}

export default WifiSetup
