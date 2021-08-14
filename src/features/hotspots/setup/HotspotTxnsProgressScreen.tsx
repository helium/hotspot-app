import React, { useEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { isString } from 'lodash'
import { AddGatewayV1 } from '@helium/transactions'
import Box from '../../../components/Box'
import { DebouncedButton } from '../../../components/Button'
import RingLoader from '../../../components/Loaders/RingLoader'
import Text from '../../../components/Text'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'
import SafeAreaBox from '../../../components/SafeAreaBox'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { getHotspotDetails } from '../../../utils/appDataClient'
import { RootState } from '../../../store/rootReducer'
import * as Logger from '../../../utils/logger'
import useAlert from '../../../utils/useAlert'
import { HotspotErrorCode } from '../../../utils/useHotspot'
import { assertLocationTxn } from '../../../utils/assertLocationUtils'
import useSubmitTxn from '../../../hooks/useSubmitTxn'
import { HotspotSetupStackParamList } from './hotspotSetupTypes'

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotTxnsProgressScreen'>

const HotspotTxnsProgressScreen = () => {
  const { t } = useTranslation()
  const { params } = useRoute<Route>()
  const navigation = useNavigation<RootNavigationProp>()
  const [finished, setFinished] = useState(false)
  const { hotspotCoords, gain, elevation } = useSelector(
    (state: RootState) => state.hotspotOnboarding,
  )
  const connectedHotspot = useSelector(
    (state: RootState) => state.connectedHotspot,
  )
  const { showOKAlert } = useAlert()
  const { addGatewayTxn } = useConnectedHotspotContext()
  const submitTxn = useSubmitTxn()

  const handleError = async (
    error: false | Error | string,
    source: 'assert_location' | 'add_gateway',
  ) => {
    if (error) {
      Logger.error(error)
    }

    let titleKey = 'generic.error'
    let messageKey = 'hotspot_setup.add_hotspot.add_hotspot_error_body'

    if (isString(error)) {
      if (error === HotspotErrorCode.WAIT) {
        messageKey = t('hotspot_setup.add_hotspot.wait_error_body')
        titleKey = t('hotspot_setup.add_hotspot.wait_error_title')
      } else {
        messageKey = `Got error code ${error} from ${source}`
      }
    } else if (error !== false) {
      messageKey = error.toString()
    }

    await showOKAlert({ titleKey, messageKey })
    navigation.navigate('MainTabs')
  }

  const hotspotOnChain = async (address: string): Promise<boolean> => {
    try {
      await getHotspotDetails(address)
      return true
    } catch (error) {
      return false
    }
  }

  const submitOnboardingTxns = async () => {
    const qrAddGatewayTxn = params?.addGatewayTxn

    if (!connectedHotspot.address && !qrAddGatewayTxn) {
      showOKAlert({
        titleKey: 'hotspot_setup.onboarding_error.title',
        messageKey: 'hotspot_setup.onboarding_error.disconnected',
      })
      return
    }

    if (qrAddGatewayTxn && !params?.hotspotAddress) {
      showOKAlert({
        titleKey: 'hotspot_setup.onboarding_error.title',
        messageKey: 'hotspot_setup.onboarding_error.subtitle',
      })
      return
    }

    const address = params?.hotspotAddress || connectedHotspot.address || ''

    // check if add gateway needed
    const isOnChain = await hotspotOnChain(address)
    if (!isOnChain) {
      // if so, construct and publish add gateway

      if (qrAddGatewayTxn) {
        // Gateway Txn scanned from QR
        try {
          const addGateway = AddGatewayV1.fromString(qrAddGatewayTxn)
          await submitTxn(addGateway)
        } catch (error) {
          handleError(error, 'add_gateway')
          return
        }
      } else {
        try {
          const addGatewayResponse = await addGatewayTxn()
          if (addGatewayResponse !== true) {
            handleError(addGatewayResponse, 'add_gateway')
            return
          }
        } catch (error) {
          handleError(error, 'add_gateway')
          return
        }
      }
    }

    // construct and publish assert location
    if (hotspotCoords) {
      const [lng, lat] = hotspotCoords
      try {
        const onboardingRecord =
          params?.onboardingRecord || connectedHotspot.onboardingRecord
        const assertLocTxnResponse = await assertLocationTxn({
          gateway: address,
          lat,
          lng,
          decimalGain: gain,
          elevation,
          onboardingRecord,
          updatingLocation: true,
          dataOnly: false,
        })
        if (assertLocTxnResponse) {
          await submitTxn(assertLocTxnResponse)
          setFinished(true)
          return
        }
        handleError(false, 'assert_location')
      } catch (error) {
        handleError(error, 'assert_location')
      }
    } else {
      setFinished(true)
    }
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
      <DebouncedButton
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
