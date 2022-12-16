import React, { useState, useCallback } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, StyleSheet } from 'react-native'
import BackScreen from '../../../components/BackScreen'
import Text from '../../../components/Text'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import TextInput from '../../../components/TextInput'
import Button, { DebouncedButton } from '../../../components/Button'
import Password from '../../../assets/images/password.svg'
import Box from '../../../components/Box'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotSetupWifiScreen'>
const HotspotSetupWifiScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const rootNav = useNavigation<RootNavigationProp>()

  const {
    params: { network },
  } = useRoute<Route>()
  const [password, setPassword] = useState('')
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  const toggleSecureEntry = useCallback(() => {
    setSecureTextEntry(!secureTextEntry)
  }, [secureTextEntry])

  const handleClose = useCallback(() => rootNav.navigate('MainTabs'), [rootNav])

  const navNext = async () => {
    navigation.replace('HotspotSetupWifiConnectingScreen', {
      network,
      password,
    })
  }

  return (
    <BackScreen onClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior="padding"
      >
        <Box flex={1} justifyContent="center" paddingBottom="xxl">
          <Box flexDirection="row" justifyContent="center" marginBottom="m">
            <Password />
          </Box>
          <Box>
            <Text
              variant="h1"
              textAlign="center"
              marginBottom="m"
              maxFontSizeMultiplier={1}
            >
              {t('hotspot_setup.wifi_password.join_title')}
            </Text>
            <Text
              variant="subtitleLight"
              textAlign="center"
              marginBottom="xl"
              maxFontSizeMultiplier={1.2}
            >
              {t('hotspot_setup.wifi_password.subtitle')}
            </Text>
            <Text variant="body1Bold" marginBottom="s">
              {network}
            </Text>
          </Box>
          <TextInput
            padding="m"
            variant="regular"
            placeholder={t('hotspot_setup.wifi_password.placeholder')}
            onChangeText={setPassword}
            value={password}
            keyboardAppearance="dark"
            autoCorrect={false}
            autoComplete="off"
            autoCapitalize="none"
            blurOnSubmit={false}
            returnKeyType="done"
            onSubmitEditing={navNext}
            secureTextEntry={secureTextEntry}
            autoFocus
          />
          <Button
            marginTop="s"
            onPress={toggleSecureEntry}
            variant="primary"
            mode="text"
            title={
              secureTextEntry
                ? t('hotspot_settings.wifi.show_password')
                : t('hotspot_settings.wifi.hide_password')
            }
          />
        </Box>
      </KeyboardAvoidingView>
      <Box>
        <DebouncedButton
          onPress={navNext}
          variant="primary"
          mode="contained"
          title={t('generic.connect')}
        />
      </Box>
    </BackScreen>
  )
}

export default HotspotSetupWifiScreen

const styles = StyleSheet.create({ keyboardAvoidingView: { flex: 1 } })
