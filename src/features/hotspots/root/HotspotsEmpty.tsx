import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import HotspotIcon from '../../../assets/images/blueHotspotIcon.svg'
import Text from '../../../components/Text'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'
import { EXPLORER_BASE_URL } from '../../../utils/config'

const HotspotsEmpty = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<RootNavigationProp>()
  const goToExplorer = () => Linking.openURL(`${EXPLORER_BASE_URL}/coverage`)
  return (
    <Box justifyContent="center" flex={1} padding="l">
      <HotspotIcon />
      <Text variant="h2" paddingVertical="l">
        {t('hotspots.owned.title')}
      </Text>
      <Text variant="subtitleRegular" paddingBottom="l" color="grayText">
        {t('hotspots.empty.body')}
      </Text>
      <Button
        onPress={() => {
          navigation.push('HotspotSetup')
        }}
        mode="contained"
        variant="primary"
        title={t('hotspots.new.setup')}
      />
      <Button onPress={goToExplorer} title={t('hotspots.new.explorer')} />
    </Box>
  )
}

export default HotspotsEmpty
