/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react'
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
import Text from '../../../components/Text'

import * as Logger from '../../../utils/logger'
import useSubmitTxn from '../../../hooks/useSubmitTxn'
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

function HotspotLocationUpdateScreen({ route }: Props) {
  const { hotspotAddress } = route.params
  const { longitude, latitude } = route.params.location
  const account = useSelector((state: RootState) => state.account.account)
  const hotspots = useSelector((state: RootState) => state.hotspots.hotspots)
  const hotspot = hotspots.find((h) => h.address === hotspotAddress)

  const { t } = useTranslation()
  const submitTxn = useSubmitTxn()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [locationName, setLocationName] = useState('')

  // Find location name based on lng/lat
  useEffect(() => {
    async function getLocationName() {
      const results = await reverseGeocode(latitude, longitude)
      if (results.length > 0) {
        const [{ street, city, isoCountryCode }] = results
        if (street && city) {
          setLocationName([street, city, isoCountryCode].join(', '))
        }
      }
    }
    getLocationName()
  }, [latitude, longitude])

  const constructTransaction = async () => {
    if (!hotspot) return
    const hotspotGain = hotspot.gain ? hotspot.gain / 10 : 1.2
    return assertLocationTxn(
      hotspot.address,
      latitude,
      longitude,
      hotspotGain,
      hotspot.elevation,
      undefined,
      true,
    )
  }

  const onClose = () => {
    navigation.goBack()
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

  // Calculate reassert fee for hotspot
  const { result: feeData = DEFAULT_FEE_DATA } = useAsync(() => {
    if (hotspot) {
      return loadLocationFeeData(
        hotspot.nonce,
        account?.balance?.integerBalance,
      )
    }
    return Promise.resolve(DEFAULT_FEE_DATA)
  }, [hotspot?.nonce, account?.balance?.integerBalance])

  return (
    <SafeAreaBox backgroundColor="primaryBackground" flex={1}>
      <BottomSheetModalProvider>
        <UpdateHotspotHeader onClose={onClose} isLocationChange />
        <Box backgroundColor="white" flex={1} padding="m">
          {hotspot ? (
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
          ) : (
            <Text color="redMedium">No hotspot found for address</Text>
          )}
        </Box>
      </BottomSheetModalProvider>
    </SafeAreaBox>
  )
}

export default HotspotLocationUpdateScreen
