import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import HotspotIcon from '../../../assets/images/blueHotspotIcon.svg'
import Text from '../../../components/Text'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'
import { RootState } from '../../../store/rootReducer'

const HotspotsEmpty = ({
  onOpenExplorer,
  lightTheme,
  locationBlocked,
}: {
  onOpenExplorer?: () => void
  lightTheme?: boolean
  locationBlocked: boolean
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation<RootNavigationProp>()
  const goToSetup = () => navigation.push('HotspotSetup')
  const fetchHotspotsFailed = useSelector(
    (state: RootState) => state.hotspots.failure,
  )
  return (
    <Box padding="l">
      <HotspotIcon />
      <Text
        variant="h2"
        paddingTop="l"
        paddingBottom="m"
        color={lightTheme ? 'black' : 'white'}
      >
        {fetchHotspotsFailed
          ? t('generic.something_went_wrong')
          : t('hotspots.owned.title')}
      </Text>
      <Text variant="subtitleRegular" paddingBottom="l" color="grayText">
        {fetchHotspotsFailed
          ? t('hotspots.empty.failed')
          : t('hotspots.empty.body')}
      </Text>
      <Button
        onPress={goToSetup}
        mode="contained"
        variant="primary"
        title={t('hotspots.new.setup')}
      />
      {!locationBlocked && (
        <Button onPress={onOpenExplorer} title={t('hotspots.new.explorer')} />
      )}
    </Box>
  )
}

export default HotspotsEmpty
