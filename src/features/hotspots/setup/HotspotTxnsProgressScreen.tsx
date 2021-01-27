import React, { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import RingLoader from '../../../components/Loaders/RingLoader'
import Text from '../../../components/Text'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'
import SafeAreaBox from '../../../components/SafeAreaBox'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { getHotspotDetails } from '../../../utils/appDataClient'
import { HotspotSetupStackParamList } from './hotspotSetupTypes'
import { RootState } from '../../../store/rootReducer'

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotTxnsProgressScreen'>

const HotspotTxnsProgressScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<RootNavigationProp>()
  const [finished, setFinished] = useState(false)
  const {
    params: { hotspotCoords },
  } = useRoute<Route>()
  const [lng, lat] = hotspotCoords
  const { connectedHotspot } = useSelector((state: RootState) => state)

  const { addGatewayTxn, assertLocationTxn } = useConnectedHotspotContext()

  // TODO better error handling here?
  const addGatewayError = () => {
    Alert.alert(
      'Error',
      'There was an error constructing the Add Hotspot transaction. Please try again.',
    )
  }

  const assertLocError = () => {
    Alert.alert(
      'Error',
      'There was an error constructing the Assert Location transaction. Please try again.',
    )
  }

  const submitOnboardingTxns = async () => {
    if (!connectedHotspot.address) {
      Alert.alert(
        'Error',
        'There was an error connecting to the Hotspot. Please try again.',
      )
      return
    }

    // check if add gateway needed
    const existingHotspot = await getHotspotDetails(connectedHotspot.address)

    if (existingHotspot) {
      // if so, construct and publish add gateway
      try {
        const addGatewaySuccess = await addGatewayTxn()
        if (!addGatewaySuccess) {
          addGatewayError()
          return
        }
      } catch (error) {
        addGatewayError()
        console.error(error)
        return
      }
    }

    // construct and publish assert location
    try {
      const assertLocTxnSuccess = await assertLocationTxn(lat, lng)
      if (!assertLocTxnSuccess) {
        assertLocError()
        return
      }
    } catch (error) {
      assertLocError()
      console.error(error)
      return
    }

    setFinished(true)
  }

  useEffect(() => {
    submitOnboardingTxns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
