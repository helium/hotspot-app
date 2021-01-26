import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import RingLoader from '../../../components/Loaders/RingLoader'
import Text from '../../../components/Text'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'
import sleep from '../../../utils/sleep'
import SafeAreaBox from '../../../components/SafeAreaBox'

const HotspotTxnsProgressScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<RootNavigationProp>()
  const [finished, setFinished] = useState(false)

  const submitOnboardingTxns = async () => {
    // check if add gateway needed

    // if so, construct and publish add gateway
    await sleep(10000)

    // construct and publish assert location

    setFinished(true)
  }

  useEffect(() => {
    submitOnboardingTxns()
  }, [])

  return (
    <SafeAreaBox
      flex={1}
      backgroundColor="primaryBackground"
      padding="lx"
      paddingTop="xxl"
    >
      <Box flex={1} alignItems="center" paddingTop="xxl">
        <Box marginBottom="xxl">
          <RingLoader color="purple" />
        </Box>
        <Text variant="subtitleMono" marginBottom="l">
          {t('hotspot_setup.progress.title')}
        </Text>
        <Box paddingHorizontal="l">
          {finished && (
            <Text variant="body1Light" textAlign="center" marginBottom="l">
              {t('hotspot_setup.progress.subtitle')}
            </Text>
          )}
        </Box>
      </Box>
      <Button
        onPress={() => navigation.navigate('MainTabs')}
        variant="primary"
        width="100%"
        mode="contained"
        title={t('hotspot_setup.progress.next')}
        disabled={!finished}
      />
    </SafeAreaBox>
  )
}

export default HotspotTxnsProgressScreen
