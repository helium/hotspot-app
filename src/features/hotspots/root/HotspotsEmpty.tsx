import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'

const HotspotsEmpty = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<RootNavigationProp>()
  return (
    <Box justifyContent="flex-end" flex={1}>
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
