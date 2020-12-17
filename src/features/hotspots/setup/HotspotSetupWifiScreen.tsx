import React, { useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import BackScreen from '../../../components/BackScreen'
import Text from '../../../components/Text'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import TextInput from '../../../components/TextInput'
import Button from '../../../components/Button'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import useAlert from '../../../utils/useAlert'
import { RootState } from '../../../store/rootReducer'

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotSetupWifiScreen'>
const HotspotSetupWifiScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const {
    params: { network },
  } = useRoute<Route>()
  const [password, setPassword] = useState('')
  const {
    setWifiCredentials,
    checkFirmwareCurrent,
  } = useConnectedHotspotContext()

  const { connectedHotspot } = useSelector((state: RootState) => state)

  const { showOKAlert } = useAlert()

  const handleSetWifi = async () => {
    setWifiCredentials(network, password, async (response) => {
      if (response === 'error') {
        // TODO: Handle Failure
        showOKAlert({ titleKey: 'something went wrong' })
      } else if (response === 'invalid') {
        // TODO: Handle incorrect password
        showOKAlert({ titleKey: 'Your password is invalid' })
      } else {
        const hasCurrentFirmware = await checkFirmwareCurrent()
        if (hasCurrentFirmware) {
          if (connectedHotspot.freeAddHotspot) {
            navigation.replace('HotspotGenesisScreen')
          } else {
            navigation.replace('HotspotSetupAddTxnScreen')
          }
        } else {
          navigation.replace('FirmwareUpdateNeededScreen')
        }
      }
    })
  }

  return (
    <BackScreen>
      <Text variant="h1">{network}</Text>
      <TextInput
        marginVertical="lx"
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
        returnKeyType="next"
        secureTextEntry
        autoFocus
      />
      <Button
        onPress={handleSetWifi}
        variant="primary"
        mode="contained"
        title={t('generic.connect')}
      />
    </BackScreen>
  )
}

export default HotspotSetupWifiScreen
