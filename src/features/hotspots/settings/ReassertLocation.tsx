/* eslint-disable react/jsx-props-no-spreading */
import Balance, { CurrencyType } from '@helium/currency'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useAsync } from 'react-async-hook'
import { useTranslation } from 'react-i18next'
import { isString } from 'lodash'
import { Hotspot } from '@helium/http'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import animateTransition from '../../../utils/animateTransition'
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
type Props = { hotspot: Hotspot; onFinished: () => void }
const ReassertLocation = ({ hotspot, onFinished }: Props) => {
  const [state, setState] = useState<
    'fee' | 'update' | 'confirm' | 'success' | 'search'
  >('fee')
  const [updatedLocation, setUpdatedLocation] = useState<Coords | undefined>()

  // TODO: Move & Fix
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
          hotspot={hotspot}
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
      return <ReassertLocationFee {...feeData} hotspot={hotspot} isPending />
  }
}

export default memo(ReassertLocation)
