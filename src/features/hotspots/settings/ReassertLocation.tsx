/* eslint-disable react/jsx-props-no-spreading */
import Balance, { CurrencyType } from '@helium/currency'
import { LocationGeocodedAddress } from 'expo-location'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useAsync } from 'react-async-hook'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { isString } from 'lodash'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import { getLocation } from '../../../store/user/appSlice'
import animateTransition from '../../../utils/animateTransition'
import { reverseGeocode } from '../../../utils/location'
import useAlert from '../../../utils/useAlert'
import ReassertLocationFee from './ReassertLocationFee'
import ReassertLocationUpdate from './ReassertLocationUpdate'
import { useHotspotSettingsContext } from './HotspotSettingsProvider'
import { decimalSeparator, groupSeparator } from '../../../utils/i18n'
import ReassertAddressSearch from './ReassertAddressSearch'
import { PlaceGeography } from '../../../utils/googlePlaces'
import { HotspotErrorCode } from '../../../utils/useHotspot'

type Coords = { latitude: number; longitude: number }
const DEFAULT_FEE_DATA = {
  remainingFreeAsserts: 0,
  totalStakingAmountDC: new Balance(0, CurrencyType.dataCredit),
  totalStakingAmountUsd: new Balance(0, CurrencyType.usd),
  totalStakingAmount: new Balance(0, CurrencyType.networkToken),
  hasSufficientBalance: false,
  isFree: false,
}
type Props = { onFinished: () => void }
const ReassertLocation = ({ onFinished }: Props) => {
  const [state, setState] = useState<
    'fee' | 'update' | 'confirm' | 'success' | 'search'
  >('fee')
  const [locationAddress, setLocationAddress] = useState<
    LocationGeocodedAddress | undefined
  >()
  const [updatedLocation, setUpdatedLocation] = useState<Coords | undefined>()
  const dispatch = useAppDispatch()
  const {
    app: { currentLocation },
  } = useSelector((s: RootState) => s)

  const { loadLocationFeeData } = useConnectedHotspotContext()

  const { result: feeData = DEFAULT_FEE_DATA } = useAsync(
    loadLocationFeeData,
    [],
  )
  const { t } = useTranslation()
  const { enableBack } = useHotspotSettingsContext()

  const { showOKAlert } = useAlert()

  const handleBack = useCallback(() => {
    animateTransition()
    switch (state) {
      case 'fee':
      case 'success':
        onFinished()
        break
      case 'update':
        setState('fee')
        break
      case 'confirm':
        setState('update')
        break
    }
  }, [onFinished, state])

  useEffect(() => {
    enableBack(handleBack)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(getLocation())
  }, [dispatch])

  useEffect(() => {
    if (!currentLocation) return

    const getLoc = async () => {
      const locInfo = await reverseGeocode(
        currentLocation.latitude,
        currentLocation.longitude,
      )
      if (!locInfo.length) return

      setLocationAddress(locInfo[0])
    }
    getLoc()
  }, [currentLocation])

  useEffect(() => {
    if (!updatedLocation) return

    const getLoc = async () => {
      const locInfo = await reverseGeocode(
        updatedLocation.latitude,
        updatedLocation.longitude,
      )
      if (!locInfo.length) return

      setLocationAddress(locInfo[0])
    }
    getLoc()
  }, [updatedLocation])

  const handleFinish = useCallback(
    async (assertResponse: Error | string | boolean) => {
      if (assertResponse === true) {
        animateTransition()
        setState('success')
        return
      }

      let titleKey = 'generic.error'
      let messageKey = 'hotspot_setup.add_hotspot.add_hotspot_error_body'
      if (isString(assertResponse)) {
        if (assertResponse === HotspotErrorCode.WAIT) {
          titleKey = t('hotspot_setup.add_hotspot.wait_error_title')
          messageKey = t('hotspot_setup.add_hotspot.wait_error_body')
        } else {
          messageKey = `Got error code ${assertResponse} from assert location`
        }
      } else if (assertResponse !== false) {
        messageKey = assertResponse.toString()
      }

      await showOKAlert({
        titleKey,
        messageKey,
      })

      onFinished()
    },
    [onFinished, showOKAlert, t],
  )

  const handleSearch = useCallback(() => {
    animateTransition()
    setState('search')
  }, [])

  const handleSearchSelectPlace = useCallback((place: PlaceGeography) => {
    const { lat, lng } = place
    setUpdatedLocation({ latitude: lat, longitude: lng })
    animateTransition()
    setState('confirm')
  }, [])

  const amount = feeData.isFree
    ? 'O DC'
    : feeData.totalStakingAmountDC.toString(0, {
        groupSeparator,
        decimalSeparator,
      })

  switch (state) {
    case 'fee':
      return (
        <ReassertLocationFee
          {...feeData}
          locationAddress={locationAddress}
          onChangeLocation={() => {
            animateTransition()
            setState('update')
          }}
        />
      )
    case 'update':
      return (
        <ReassertLocationUpdate
          amount={amount}
          key={state}
          onCancel={handleBack}
          onSearch={handleSearch}
          locationSelected={(latitude, longitude) => {
            setUpdatedLocation({ latitude, longitude })
            animateTransition()
            setState('confirm')
          }}
        />
      )
    case 'search':
      return <ReassertAddressSearch onSelectPlace={handleSearchSelectPlace} />
    case 'confirm':
      return (
        <ReassertLocationUpdate
          amount={amount}
          key={state}
          onCancel={handleBack}
          confirming
          coords={updatedLocation}
          onFinish={handleFinish}
          onSearch={handleSearch}
        />
      )
    case 'success':
      return (
        <ReassertLocationFee
          {...feeData}
          locationAddress={locationAddress}
          isPending
        />
      )
  }
}

export default memo(ReassertLocation)
