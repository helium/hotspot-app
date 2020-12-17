import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import BackScreen from '../../../components/BackScreen'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { RootState } from '../../../store/rootReducer'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'

const HotspotEthernetScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const { checkFirmwareCurrent } = useConnectedHotspotContext()

  const { connectedHotspot } = useSelector((state: RootState) => state)

  const navNext = async () => {
    const hasCurrentFirmware = await checkFirmwareCurrent()
    if (hasCurrentFirmware) {
      if (connectedHotspot.freeAddHotspot) {
        navigation.push('HotspotGenesisScreen')
      } else {
        navigation.push('HotspotSetupAddTxnScreen')
      }
    } else {
      navigation.push('FirmwareUpdateNeededScreen')
    }
  }

  return (
    <BackScreen>
      <Text variant="h1" numberOfLines={1} adjustsFontSizeToFit>
        {t('hotspot_setup.ethernet.title')}
      </Text>
      <Text variant="subtitle" marginVertical="l">
        {t('hotspot_setup.ethernet.subtitle')}
      </Text>
      <Button
        onPress={navNext}
        variant="primary"
        mode="contained"
        title={t('hotspot_setup.ethernet.next')}
      />
    </BackScreen>
  )
}

export default HotspotEthernetScreen
