import React, { useState } from 'react'
import { Alert } from 'react-native'
import { RouteProp, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useAsync } from 'react-async-hook'
import { useSelector } from 'react-redux'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import Toast from 'react-native-simple-toast'

import UpdateHotspotHeader from '../settings/updateHotspot/UpdateHotspotHeader'
import ReassertLocationFee from '../settings/ReassertLocationFee'
import { DEFAULT_FEE_DATA } from '../settings/ReassertLocation'

import Box from '../../../components/Box'
import SafeAreaBox from '../../../components/SafeAreaBox'

import useSubmitTxn from '../../../hooks/useSubmitTxn'
import * as Logger from '../../../utils/logger'
import { getOnboardingRecord } from '../../../utils/stakingClient'
import { reverseGeocode } from '../../../utils/location'
import {
  assertLocationTxn,
  loadLocationFeeData,
} from '../../../utils/assertLocationUtils'
import { HotspotStackParamList } from './hotspotTypes'
import { RootState } from '../../../store/rootReducer'

type Route = RouteProp<HotspotStackParamList, 'HotspotLocationUpdateScreen'>

type Props = {
  route: Route
}

/**
 * HotspotLocationUpdateScreen allows users to update the location of one of their hotspots within
 * a single view. It expects the hotspot address and new location (represented by lat/lng pair) to
 * be provided via navigation params, and shows the new location to the user (along with the associated
 * fee).
 *
 * Pressing "I confirm" will submit an "assert location" transaction to the blockchain and redirect
 * the user ("navigation.goBack").
 *
 * If an invalid hotspot address is provided, or the address belongs to a hotspot owned by another
 * user, a simple error message will be displayed in place of the reassert form.
 */
function HotspotLocationUpdateScreen({ route }: Props) {
  const { hotspotAddress } = route.params
  const { longitude, latitude } = route.params.location
  const account = useSelector((state: RootState) => state.account.account)
  const hotspots = useSelector(
    (state: RootState) => state.hotspots.hotspots.data,
  )
  const hotspot = hotspots.find((h) => h.address === hotspotAddress)

  const { t } = useTranslation()
  const submitTxn = useSubmitTxn()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)

  // Find location name based on lng/lat
  const { result: locationName } = useAsync(async () => {
    const results = await reverseGeocode(latitude, longitude)
    if (results.length > 0) {
      const [{ street, city, isoCountryCode }] = results
      if (street && city) {
        return [street, city, isoCountryCode].join(', ')
      }
    }
  }, [])

  // Find onboardingRecord for selected hotspot if available
  const { result: onboardingRecord } = useAsync(
    async () =>
      hotspot
        ? getOnboardingRecord(hotspot.address)
        : Promise.resolve(undefined),
    [hotspot?.address],
  )

  // Calculate reassert fee for hotspot
  const { result: feeData = DEFAULT_FEE_DATA } = useAsync(() => {
    if (hotspot) {
      return loadLocationFeeData({
        nonce: hotspot.nonce,
        accountIntegerBalance: account?.balance?.integerBalance,
        onboardingRecord,
      })
    }
    return Promise.resolve(DEFAULT_FEE_DATA)
  }, [hotspot?.nonce, account?.balance?.integerBalance, onboardingRecord])

  const constructTransaction = async () => {
    if (!hotspot) return
    return assertLocationTxn({
      gateway: hotspot.address,
      lat: latitude,
      lng: longitude,
      decimalGain: hotspot.gain ? hotspot.gain / 10 : 1.2,
      elevation: hotspot.elevation,
      onboardingRecord,
      updatingLocation: true,
      dataOnly: false,
    })
  }

  const onSubmit = async () => {
    setLoading(true)
    try {
      const txn = await constructTransaction()
      if (txn) {
        await submitTxn(txn)
        navigation.navigate('Wallet')
        onClose()
        setTimeout(() => {
          Toast.show(t('hotspot_settings.reassert.submit'), Toast.LONG)
        }, 500)
      } else {
        setLoading(false)
        Logger.error(new Error('Assert failed with null txn'))
        Alert.alert(
          t('generic.error'),
          t('hotspot_setup.add_hotspot.assert_loc_error_body'),
        )
      }
    } catch (error) {
      setLoading(false)
      Logger.error(error)
      Alert.alert(
        t('generic.error'),
        t('hotspot_setup.add_hotspot.assert_loc_error_body'),
      )
    }
  }

  const onClose = () => {
    navigation.goBack()
  }

  return (
    <SafeAreaBox backgroundColor="primaryBackground" flex={1}>
      <BottomSheetModalProvider>
        <UpdateHotspotHeader onClose={onClose} isLocationChange />
        <Box backgroundColor="white" flex={1} padding="m">
          {!!hotspot && (
            <ReassertLocationFee
              hasSufficientBalance={feeData.hasSufficientBalance}
              hotspot={hotspot}
              isFree={feeData.isFree}
              isLoading={loading}
              onCancel={onClose}
              onChangeLocation={onSubmit}
              newLocation={{ latitude, longitude, name: locationName }}
              remainingFreeAsserts={feeData.remainingFreeAsserts}
              totalStakingAmountDC={feeData.totalStakingAmountDC}
              totalStakingAmountUsd={feeData.totalStakingAmountUsd}
            />
          )}
        </Box>
      </BottomSheetModalProvider>
    </SafeAreaBox>
  )
}

export default HotspotLocationUpdateScreen
