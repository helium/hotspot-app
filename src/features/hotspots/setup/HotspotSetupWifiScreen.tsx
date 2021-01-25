import React, { useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView } from 'react-native'
import BackScreen from '../../../components/BackScreen'
import Text from '../../../components/Text'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import TextInput from '../../../components/TextInput'
import Button from '../../../components/Button'
import Password from '../../../assets/images/password.svg'
import Box from '../../../components/Box'

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotSetupWifiScreen'>
const HotspotSetupWifiScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const {
    params: { network },
  } = useRoute<Route>()
  // const network = 'Panic at the Cisco'
  const [password, setPassword] = useState('')

  const navNext = async () => {
    navigation.navigate('HotspotSetupWifiConnectingScreen', {
      network,
      password,
    })
  }

  return (
    <BackScreen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <Box flex={1} justifyContent="center" paddingBottom="xxl">
          <Box flexDirection="row" justifyContent="center" marginBottom="m">
            <Password />
          </Box>
          <Box>
            <Text variant="h1" textAlign="center" marginBottom="m">
              {t('hotspot_setup.wifi_password.join_title')}
            </Text>
            <Text variant="subtitleLight" textAlign="center" marginBottom="xl">
              {t('hotspot_setup.wifi_password.subtitle')}
            </Text>
            <Text variant="body1Bold" marginBottom="s">
              {network}
            </Text>
          </Box>
          <TextInput
            marginBottom="lx"
            padding="m"
            variant="regular"
            placeholder={t('hotspot_setup.wifi_password.placeholder')}
            onChangeText={setPassword}
            value={password}
            keyboardAppearance="dark"
            autoCorrect={false}
            autoCompleteType="off"
            autoCapitalize="none"
            blurOnSubmit={false}
            returnKeyType="done"
            onSubmitEditing={navNext}
            secureTextEntry
            autoFocus
          />
        </Box>
      </KeyboardAvoidingView>
      <Box>
        <Button
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
