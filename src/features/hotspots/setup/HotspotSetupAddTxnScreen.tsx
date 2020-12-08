import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { RootState } from '../../../store/rootReducer'
import { currencyFormat } from '../../../utils/currency'
import { calculatePaymentTxnFee } from '../../../utils/transactions'
import usePermissionManager from '../../../utils/usePermissionManager'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'

const HotspotSetupAddTxnScreen = () => {
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const { t } = useTranslation()
  const [fee, setFee] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const { updateHotspotStatus, addGatewayTxn } = useConnectedHotspotContext()

  const {
    account: { account },
    connectedHotspot: { mac, freeAddHotspot, status: hotspotStatus },
  } = useSelector((state: RootState) => state)
  const { hasLocationPermission } = usePermissionManager()

  const navNext = async () => {
    if (hotspotStatus === 'global') {
      navigation.popToTop()
      return
    }

    if (hotspotStatus === 'owned' || hotspotStatus === 'new') {
      const hasLocPerm = await hasLocationPermission()
      if (hasLocPerm) navigation.push('HotspotLocationFeeScreen')
      else navigation.push('EnableLocationScreen')
    }
  }

  const act = async () => {
    if (hotspotStatus === 'new') {
      setSubmitting(true)

      const txn = await addGatewayTxn()
      setSubmitting(false)
      if (txn) {
        navNext()
      }
    } else {
      navNext()
    }
  }

  useEffect(() => {
    // TODO: Verify this is correct
    if (freeAddHotspot) {
      setFee(0)
      return
    }

    const calc = async () => {
      const nonce = account?.nonce ? account.nonce + 1 : 0
      // TODO:                                            ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
      const val = await calculatePaymentTxnFee(0, nonce, 'what should this be?')
      setFee(val || 0)
    }

    calc()
  }, [account?.nonce, freeAddHotspot])

  const dcIntBalance = useMemo(() => account?.dcBalance?.integerBalance || 0, [
    account?.dcBalance?.integerBalance,
  ])

  useEffect(() => {
    updateHotspotStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getSubText = () => {
    if (hotspotStatus === 'error' || hotspotStatus === 'new') return null

    let suffix = ''
    switch (hotspotStatus) {
      case 'global':
        suffix = 'not_owned'
        break
      case 'owned':
        suffix = 'already_added'
        break
      case 'initial':
        suffix = 'checking_status'
        break
    }

    return (
      <Text variant="body1">{t(`hotspot_setup.add_hotspot.${suffix}`)}</Text>
    )
  }

  const getNewContent = () => {
    if (hotspotStatus !== 'new') return null
    return (
      <>
        <Text variant="body1">{t('hotspot_setup.add_hotspot.label')}</Text>
        <Text
          variant="subtitleBold"
          style={{
            textDecorationLine: freeAddHotspot ? 'line-through' : 'none',
          }}
        >
          $40.00
        </Text>
        {freeAddHotspot && (
          <Text variant="body1">{`${currencyFormat(fee)}`}</Text>
        )}
        {dcIntBalance >= fee ? (
          <Text variant="body1">
            {`${t('generic.balance')}: ${currencyFormat(dcIntBalance)}`}
          </Text>
        ) : (
          <Text style={{ color: '#ED5C5C', marginBottom: 20 }}>
            {`${t('generic.balance')}: ${currencyFormat(dcIntBalance)}`}
          </Text>
        )}
      </>
    )
  }

  return (
    <BackScreen>
      <Text variant="header" numberOfLines={1} adjustsFontSizeToFit>
        {t('hotspot_setup.add_hotspot.title')}
      </Text>
      <Text variant="subtitle" marginVertical="l">
        {t('hotspot_setup.add_hotspot.subtitle')}
      </Text>

      {getSubText()}

      {getNewContent()}

      {!freeAddHotspot && (
        <Text variant="body1">
          {t('hotspot_setup.add_hotspot.error', {
            mac,
          })}
        </Text>
      )}

      <Box flex={1} />
      <Button
        onPress={act}
        mode="contained"
        disabled={!freeAddHotspot || dcIntBalance < fee || submitting}
        title={
          hotspotStatus === 'global'
            ? t('hotspot_setup.add_hotspot.back')
            : t('generic.next')
        }
      />
    </BackScreen>
  )
}

export default HotspotSetupAddTxnScreen
