import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Text from '../../components/Text'
import Miner from '../../assets/images/miner.svg'
import SafeAreaBox from '../../components/SafeAreaBox'
import Button from '../../components/Button'
import Box from '../../components/Box'
import appSlice from '../../store/user/appSlice'
import { useAppDispatch } from '../../store/store'
import TouchableOpacityBox from '../../components/TouchableOpacityBox'
import GlobalHelpModal from '../../components/GlobalHelpModal'

const SetupHotspotEducationScreen = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [showHelpModal, setShowHelpModal] = useState(false)

  return (
    <SafeAreaBox
      flex={1}
      backgroundColor="primaryBackground"
      alignItems="center"
      paddingHorizontal="lx"
    >
      <Box flex={1} />
      <Box maxHeight={{ smallPhone: 200, phone: 300 }}>
        <Miner height="100%" />
      </Box>
      <Text variant="h1" marginTop="xl">
        {t('hotspot_setup.start.title')}
      </Text>
      <Text
        variant="subtitle"
        textAlign="center"
        marginVertical="m"
        numberOfLines={2}
        adjustsFontSizeToFit
      >
        {t('hotspot_setup.start.subtitle')}
      </Text>
      <TouchableOpacityBox onPress={() => setShowHelpModal(true)}>
        <Text variant="subtitleBold" textAlign="center" marginVertical="xs">
          {t('hotspot_setup.start.info')}
        </Text>
      </TouchableOpacityBox>

      <Box flex={1} />
      <Box width="100%">
        <Button
          mode="contained"
          variant="primary"
          onPress={() => {
            dispatch(appSlice.actions.setupHotspot())
          }}
          title={t('hotspot_setup.start.next')}
        />
        <Button
          variant="secondary"
          onPress={() => {
            dispatch(appSlice.actions.finishEducation())
          }}
          title={t('hotspot_setup.start.not_now')}
        />
      </Box>
      <GlobalHelpModal
        onClose={() => setShowHelpModal(false)}
        visible={showHelpModal}
      />
    </SafeAreaBox>
  )
}

export default SetupHotspotEducationScreen
