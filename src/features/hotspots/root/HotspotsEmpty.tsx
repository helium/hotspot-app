import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import HotspotIcon from '../../../assets/images/blueHotspotIcon.svg'
import Text from '../../../components/Text'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'

const HotspotsEmpty = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<RootNavigationProp>()
  return (
    <Box justifyContent="center" flex={1} padding="l">
      <HotspotIcon />
      <Text variant="h2" paddingVertical="l">
        {t('hotspots.owned.title')}
      </Text>
      <Text variant="body2" paddingBottom="l" color="grayText" fontSize={20}>
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
      <Button
        // onPress={this.goToHotspotExplorer}
        title={t('hotspots.new.explorer')}
      />
    </Box>
  )
}

export default HotspotsEmpty
