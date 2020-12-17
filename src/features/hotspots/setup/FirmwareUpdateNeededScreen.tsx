import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import BackScreen from '../../../components/BackScreen'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { RootState } from '../../../store/rootReducer'

const FirmwareUpdateNeededScreen = () => {
  const { t } = useTranslation()
  const { checkFirmwareCurrent } = useConnectedHotspotContext()
  const { connectedHotspot } = useSelector((state: RootState) => state)

  const navigation = useNavigation<RootNavigationProp>()
  useEffect(() => {
    if (!connectedHotspot.firmware?.minVersion) {
      checkFirmwareCurrent()
    }
  }, [connectedHotspot.firmware, checkFirmwareCurrent])

  return (
    <BackScreen>
      <Text variant="h1">{t('hotspot_setup.firmware_update.title')}</Text>
      <Text variant="body1">{t('hotspot_setup.firmware_update.subtitle')}</Text>
      <Text variant="body1">
        {t('hotspot_setup.firmware_update.current_version', {
          version: connectedHotspot.firmware?.version,
        })}
      </Text>
      <Text variant="body1">
        {t('hotspot_setup.firmware_update.required_version', {
          minVersion: connectedHotspot.firmware?.minVersion,
        })}
      </Text>
      <Text variant="body1">
        {t('hotspot_setup.firmware_update.explanation')}
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('MainTabs')}
        title={t('hotspot_setup.firmware_update.next')}
      />
    </BackScreen>
  )
}

export default FirmwareUpdateNeededScreen
