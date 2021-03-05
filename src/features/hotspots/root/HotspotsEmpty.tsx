import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import HotspotIcon from '../../../assets/images/blueHotspotIcon.svg'
import Text from '../../../components/Text'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'

const HotspotsEmpty = ({ onOpenExplorer }: { onOpenExplorer: () => void }) => {
  const { t } = useTranslation()
  const navigation = useNavigation<RootNavigationProp>()
  const goToSetup = () => navigation.push('HotspotSetup')
  return (
    <Box flex={1} padding="l" paddingTop="xl">
      <HotspotIcon />
      <Text variant="h2">{t('hotspots.owned.title')}</Text>
      <Text variant="subtitleRegular" paddingBottom="l" color="grayText">
        {t('hotspots.empty.body')}
      </Text>
      <Button
        onPress={goToSetup}
        mode="contained"
        variant="primary"
        title={t('hotspots.new.setup')}
      />
      <Button onPress={onOpenExplorer} title={t('hotspots.new.explorer')} />
    </Box>
  )
}

export default HotspotsEmpty
