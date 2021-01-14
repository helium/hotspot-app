import React, { useEffect, useState } from 'react'
import { useAsync } from 'react-async-hook'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, LayoutAnimation } from 'react-native'
import { capitalize, round, times } from 'lodash'
import { useSelector } from 'react-redux'
import { formatDistance, fromUnixTime, getUnixTime, format } from 'date-fns'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { RootState } from '../../../store/rootReducer'
import { useColors } from '../../../theme/themeHooks'
import DiagnosticAttribute from './DiagnosticAttribute'
import { fetchHotspotActivity } from '../../../store/connectedHotspot/connectedHotspotSlice'
import { useAppDispatch } from '../../../store/store'
import { fetchBlockHeight } from '../../../store/helium/heliumDataSlice'
import DiagnosticLineItem from './DiagnosticLineItem'
import useDevice from '../../../utils/useDevice'

const blockTimeErrorLimit = 24 * 60 * 60 // 24 hours
const initialInfo = {
  percentSynced: 0,
  fullySynced: false,
  hasLastChallenge: false,
  lastChallengeTime: 0,
  currentTime: 0,
  height: 0,
}

const formatMac = (mac: string) =>
  times(6)
    .map((i) =>
      mac
        .split('')
        .slice(i * 2, i * 2 + 2)
        .join(''),
    )
    .join(':')

const HotspotDiagnosticReport = () => {
  const {
    getDiagnosticInfo,
    checkFirmwareCurrent,
  } = useConnectedHotspotContext()
  const { purpleMain } = useColors()
  const [loading, setLoading] = useState(true)
  const [info, setInfo] = useState(initialInfo)
  const [lineItems, setLineItems] = useState<
    { attribute: string; value?: string }[]
  >([])
  const { result: diagnostics } = useAsync(getDiagnosticInfo, [])
  const { version } = useDevice()
  const { t } = useTranslation()
  const {
    connectedHotspot: {
      activity: {
        challenge_activity: { data: challenges },
      },
      type,
      firmware,
    },
    heliumData: { blockHeight },
  } = useSelector((state: RootState) => state)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setLineItems([
      {
        attribute: t('hotspot_settings.diagnostics.hotspot_type'),
        value: type,
      },
      {
        attribute: t('hotspot_settings.diagnostics.firmware'),
        value: firmware?.version || '',
      },
      {
        attribute: t('hotspot_settings.diagnostics.app_version'),
        value: version,
      },
      {
        attribute: t('hotspot_settings.diagnostics.wifi_mac'),
        value: diagnostics?.wifi ? formatMac(diagnostics.wifi) : '',
      },
      {
        attribute: t('hotspot_settings.diagnostics.eth_mac'),
        value: diagnostics?.eth ? formatMac(diagnostics.eth) : '',
      },
      {
        attribute: t('hotspot_settings.diagnostics.nat_type'),
        value: capitalize(diagnostics?.nat_type),
      },
      {
        attribute: t('hotspot_settings.diagnostics.ip'),
        value: capitalize(diagnostics?.ip),
      },
      {
        attribute: t('hotspot_settings.diagnostics.report_generated'),
        value: format(fromUnixTime(info.currentTime), 'yyyy-MM-dd hh:mm a'),
      },
    ])
  }, [diagnostics, firmware, t, type, version, info.currentTime])

  useEffect(() => {
    if (!firmware?.minVersion) {
      checkFirmwareCurrent()
    }
  }, [firmware, checkFirmwareCurrent])

  useEffect(() => {
    const nextInfo = initialInfo

    const lastChallenge = challenges.length > 0 ? challenges[0] : undefined
    nextInfo.hasLastChallenge =
      lastChallenge !== null && lastChallenge !== undefined
    nextInfo.lastChallengeTime = lastChallenge ? lastChallenge.time : 0
    nextInfo.currentTime = getUnixTime(new Date())
    nextInfo.height = parseInt(diagnostics?.height || '0', 10)

    if (blockHeight) {
      const syncedRatio = nextInfo.height / blockHeight
      const percentSynced = round(syncedRatio * 100, 2)
      const within500Blocks = nextInfo.height
        ? blockHeight - nextInfo.height <= 500
        : false
      nextInfo.fullySynced = percentSynced === 100 || within500Blocks
    }

    setInfo(nextInfo)
  }, [blockHeight, challenges, diagnostics?.height])

  useEffect(() => {
    dispatch(
      fetchHotspotActivity({ filter: 'challenge_activity', fetchCount: 1 }),
    )
    dispatch(fetchBlockHeight())
  }, [dispatch])

  useEffect(() => {
    if (diagnostics) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setLoading(false)
    }
  }, [diagnostics])

  if (loading) {
    return (
      <Box minHeight={413} justifyContent="center">
        <ActivityIndicator color={purpleMain} />
      </Box>
    )
  }

  return (
    <Box padding="l" minHeight={413}>
      <Text variant="h4" color="black" marginBottom="m">
        {t('hotspot_settings.diagnostics.p2p')}
      </Text>
      <DiagnosticAttribute
        text={t('hotspot_settings.diagnostics.outbound')}
        success={diagnostics?.connected === 'yes'}
      />
      <DiagnosticAttribute
        text={t('hotspot_settings.diagnostics.inbound')}
        success={diagnostics?.dialable === 'yes'}
      />

      <Text variant="h4" color="black" marginVertical="m">
        {t('hotspot_settings.diagnostics.blockchain_height')}
      </Text>
      <DiagnosticAttribute
        text={t('hotspot_settings.diagnostics.synced', {
          percent: info.fullySynced ? 100 : info.percentSynced,
        })}
        success={info.fullySynced}
      />

      <Text variant="h4" color="black" marginVertical="m">
        {t('hotspot_settings.diagnostics.last_challenged')}
      </Text>
      <DiagnosticAttribute
        text={
          info.hasLastChallenge
            ? formatDistance(fromUnixTime(info.lastChallengeTime), new Date(), {
                addSuffix: true,
              })
            : t('generic.unknown')
        }
        success={
          info.hasLastChallenge &&
          info.currentTime - info.lastChallengeTime < blockTimeErrorLimit
        }
      />

      <Text variant="h4" color="black" marginVertical="m">
        {t('hotspot_settings.diagnostics.etc')}
      </Text>
      {[
        lineItems.map(({ attribute, value }) => (
          <DiagnosticLineItem
            attribute={attribute}
            value={value}
            key={attribute}
          />
        )),
      ]}
    </Box>
  )
}

export default HotspotDiagnosticReport
