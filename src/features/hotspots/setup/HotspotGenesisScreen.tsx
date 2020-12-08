import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import TextTransform from '../../../components/TextTransform'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'

const HotspotGenesisScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  return (
    <BackScreen>
      <Text variant="header" numberOfLines={1} adjustsFontSizeToFit>
        {t('hotspot_setup.genesis.title')}
      </Text>
      <Text variant="subtitle" marginVertical="l">
        {t('hotspot_setup.genesis.subtitle')}
      </Text>
      <TextTransform variant="body1" i18nKey={t('hotspot_setup.genesis.p')} />

      <Box flex={1} />

      <Button
        onPress={() => navigation.push('HotspotSetupAddTxnScreen')}
        mode="contained"
        title={t('generic.next')}
      />
    </BackScreen>
  )
}

export default HotspotGenesisScreen
