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
import TouchableOpacityBox from '../../../components/BSTouchableOpacityBox'

const HotspotsEmpty = ({
  onRequestShowMap,
}: {
  onRequestShowMap?: () => void
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation<RootNavigationProp>()
  const goToSetup = () => navigation.push('HotspotSetup')
  const fetchHotspotsFailed = useSelector(
    (state: RootState) => state.hotspots.failure,
  )
  return (
    <Box padding="l" flex={1} justifyContent="center">
      <HotspotIcon />
      <Text variant="bold" fontSize={40} paddingVertical="l" color="purpleMain">
        {fetchHotspotsFailed
          ? t('generic.something_went_wrong')
          : t('hotspots.owned.title')}
      </Text>
      <Text
        variant="light"
        fontSize={19}
        lineHeight={22}
        paddingBottom="lx"
        color="purpleText"
      >
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
      <TouchableOpacityBox onPress={onRequestShowMap} padding="l">
        <Text
          paddingTop="s"
          variant="light"
          fontSize={19}
          textAlign="center"
          lineHeight={22}
          paddingBottom="lx"
          color="purpleText"
        >
          {t('hotspots.new.explorer')}
        </Text>
      </TouchableOpacityBox>
    </Box>
  )
}

export default HotspotsEmpty
