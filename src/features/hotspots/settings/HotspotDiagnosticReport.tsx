import React, { useEffect, useState } from 'react'
import { useAsync } from 'react-async-hook'
import { useTranslation } from 'react-i18next'
import { capitalize, times } from 'lodash'
import { useSelector } from 'react-redux'
import { format, formatDistance, fromUnixTime, getUnixTime } from 'date-fns'
import animalHash from 'angry-purple-tiger'
import { ScrollView } from 'react-native-gesture-handler'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { RootState } from '../../../store/rootReducer'
import DiagnosticAttribute from './DiagnosticAttribute'
import { fetchHotspotActivity } from '../../../store/connectedHotspot/connectedHotspotSlice'
import { useAppDispatch } from '../../../store/store'
import { fetchBlockHeight } from '../../../store/helium/heliumDataSlice'
import DiagnosticLineItem from './DiagnosticLineItem'
import useDevice from '../../../utils/useDevice'
import Button from '../../../components/Button'
import sendReport from './sendReport'
import Card from '../../../components/Card'
import CircleLoader from '../../../components/CircleLoader'
import { hp } from '../../../utils/layout'
import { useHotspotSettingsContext } from './HotspotSettingsProvider'
import animateTransition from '../../../utils/animateTransition'
import { locale } from '../../../utils/i18n'
import useAlert from '../../../utils/useAlert'
import usePrevious from '../../../utils/usePrevious'
import { getSyncStatus, SyncStatus } from '../../../utils/hotspotUtils'
import { getMakerSupportEmail } from '../../../makers'

type Info = {
  percentSynced: number
  lastChallengeTime: number
  currentTime: number
  height: number
  hasLastChallenge: boolean
  fullySynced: boolean | 'partial'
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

const DF = 'yyyy-MM-dd hh:mm a'

type Props = { onFinished: () => void }
const HotspotDiagnosticReport = ({ onFinished }: Props) => {
  const {
    getDiagnosticInfo,
    checkFirmwareCurrent,
  } = useConnectedHotspotContext()
  const [loading, setLoading] = useState(true)
  const [info, setInfo] = useState<Info>()
  const { showOKAlert } = useAlert()
  const [lineItems, setLineItems] = useState<
    { attribute: string; value?: string }[]
  >([])
  const { result: diagnostics, error } = useAsync(getDiagnosticInfo, [])
  const prevError = usePrevious(error)
  const { version } = useDevice()
  const { t } = useTranslation()
  const {
    activity: {
      challenge_activity: { data: challenges },
    },
    firmware,
    address,
    onboardingRecord,
  } = useSelector((state: RootState) => state.connectedHotspot)
  const { blockHeight } = useSelector((state: RootState) => state.heliumData)
  const dispatch = useAppDispatch()
  const { enableBack } = useHotspotSettingsContext()

  useEffect(() => {
    enableBack(() => onFinished())
  }, [enableBack, onFinished])

  useEffect(() => {
    const handleError = async () => {
      if (error && !prevError) {
        await showOKAlert({
          titleKey: 'generic.error',
          messageKey: error.toString(),
        })
        onFinished()
      }
    }
    handleError()
  }, [error, onFinished, showOKAlert, prevError])

  useEffect(() => {
    setLineItems([
      {
        attribute: t('hotspot_settings.diagnostics.hotspot_type'),
        value: onboardingRecord?.maker?.name || t('generic.unavailable'),
      },
      {
        attribute: t('hotspot_settings.diagnostics.firmware'),
        value: firmware?.version || t('generic.unavailable'),
      },
      {
        attribute: t('hotspot_settings.diagnostics.app_version'),
        value: version,
      },
      {
        attribute: t('hotspot_settings.diagnostics.wifi_mac'),
        value: diagnostics?.wifi
          ? formatMac(diagnostics.wifi)
          : t('generic.unavailable'),
      },
      {
        attribute: t('hotspot_settings.diagnostics.eth_mac'),
        value: diagnostics?.eth
          ? formatMac(diagnostics.eth)
          : t('generic.unavailable'),
      },
      {
        attribute: t('hotspot_settings.diagnostics.nat_type'),
        value: diagnostics?.nat_type
          ? capitalize(diagnostics.nat_type)
          : t('generic.unavailable'),
      },
      {
        attribute: t('hotspot_settings.diagnostics.ip'),
        value: diagnostics?.ip
          ? capitalize(diagnostics.ip)
          : t('generic.unavailable'),
      },
      {
        attribute: t('hotspot_settings.diagnostics.report_generated'),
        value: info?.currentTime
          ? format(fromUnixTime(info.currentTime), DF)
          : t('generic.unavailable'),
      },
    ])
  }, [
    diagnostics,
    firmware,
    t,
    version,
    info?.currentTime,
    onboardingRecord?.maker?.name,
  ])

  useEffect(() => {
    if (!firmware?.version) {
      checkFirmwareCurrent()
    }
  }, [firmware, checkFirmwareCurrent])

  useEffect(() => {
    const nextInfo = {} as Info

    const lastChallenge = challenges.length > 0 ? challenges[0] : undefined
    nextInfo.hasLastChallenge =
      lastChallenge !== null && lastChallenge !== undefined
    nextInfo.lastChallengeTime = lastChallenge ? lastChallenge.time : 0
    nextInfo.currentTime = getUnixTime(new Date())
    nextInfo.height = parseInt(diagnostics?.height || '0', 10)

    const { status } = getSyncStatus(nextInfo.height, blockHeight)
    switch (status) {
      case SyncStatus.full:
        nextInfo.fullySynced = true
        break
      case SyncStatus.partial:
        nextInfo.fullySynced = 'partial'
        break
      case SyncStatus.none:
        nextInfo.fullySynced = false
        break
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
      animateTransition('HotspotDiagnosticReport.FinishLoad')
      setLoading(false)
    }
  }, [diagnostics])

  if (loading) {
    return (
      <CircleLoader
        minHeight={363}
        justifyContent="center"
        alignItems="center"
        text={t('hotspot_settings.diagnostics.generating_report')}
      />
    )
  }

  const getLastChallengeDate = () => {
    if (info?.lastChallengeTime === undefined) return 'Unknown'
    return info?.lastChallengeTime === 0
      ? 'never'
      : format(fromUnixTime(info?.lastChallengeTime), DF)
  }

  const handleSendReport = () => {
    sendReport({
      eth: diagnostics?.eth ? formatMac(diagnostics.eth) : '',
      wifi: diagnostics?.wifi ? formatMac(diagnostics.wifi) : '',
      fw: firmware?.version || '',
      connected: diagnostics?.connected || '',
      dialable: diagnostics?.dialable || '',
      natType: capitalize(diagnostics?.nat_type || ''),
      ip: capitalize(diagnostics?.ip || ''),
      height: info?.height ? info.height.toLocaleString(locale) : 'Unknown',
      lastChallengeDate: getLastChallengeDate(),
      reportGenerated: info?.currentTime
        ? format(fromUnixTime(info.currentTime), DF)
        : 'Unknown',
      gateway: address || '',
      hotspotMaker: onboardingRecord?.maker?.name || 'Unknown',
      appVersion: version,
      supportEmail: getMakerSupportEmail(onboardingRecord?.maker?.id),
    })
  }

  return (
    <ScrollView style={{ height: hp(75) }}>
      <Box padding="l" minHeight={413}>
        <Text
          variant="medium"
          fontSize={21}
          color="black"
          marginBottom="s"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {animalHash(address || '')}
        </Text>

        <Text variant="light" fontSize={12} color="grayText" marginBottom="l">
          {t('hotspot_settings.diagnostics.unavailable_warning')}
        </Text>
        <Text variant="medium" fontSize={15} color="black" marginBottom="ms">
          {t('hotspot_settings.diagnostics.p2p')}
        </Text>

        <Box flexDirection="row">
          <Card variant="regular" flex={1} marginRight="ms" alignItems="center">
            <DiagnosticAttribute
              text={t('hotspot_settings.diagnostics.outbound')}
              success={diagnostics?.connected === 'yes'}
            />
          </Card>

          <Card variant="regular" flex={1} alignItems="center">
            <DiagnosticAttribute
              text={t('hotspot_settings.diagnostics.inbound')}
              success={diagnostics?.dialable === 'yes'}
            />
          </Card>
        </Box>

        <Text
          variant="medium"
          fontSize={15}
          color="black"
          marginBottom="s"
          marginTop="l"
        >
          {t('hotspot_settings.diagnostics.activity')}
        </Text>

        <Card variant="regular">
          <Box flexDirection="row" marginBottom="s">
            <Text variant="body2Medium" color="black" flex={1}>
              {t('hotspot_settings.diagnostics.blockchain_sync')}
            </Text>
            {info?.fullySynced !== undefined ? (
              <DiagnosticAttribute
                text={info.fullySynced ? '100%' : `${info?.percentSynced}%`}
                success={info.fullySynced}
                fontWeight="regular"
              />
            ) : (
              <Text variant="body2" color="black" marginLeft="s">
                {t('generic.unavailable')}
              </Text>
            )}
          </Box>

          <Box flexDirection="row">
            <Text variant="body2Medium" color="black" flex={1}>
              {t('hotspot_settings.diagnostics.last_challenged')}
            </Text>
            <Text variant="body2" color="black" marginLeft="s">
              {info?.hasLastChallenge
                ? formatDistance(
                    fromUnixTime(info.lastChallengeTime),
                    new Date(),
                    {
                      addSuffix: true,
                    },
                  )
                : t('generic.unavailable')}
            </Text>
          </Box>
        </Card>

        <Text
          variant="medium"
          fontSize={15}
          color="black"
          marginBottom="s"
          marginTop="l"
        >
          {t('hotspot_settings.diagnostics.other_info')}
        </Text>
        <Card variant="regular">
          {[
            lineItems.map(({ attribute, value }) => (
              <DiagnosticLineItem
                attribute={attribute}
                value={value}
                key={attribute}
              />
            )),
          ]}
        </Card>

        <Button
          marginTop="lx"
          onPress={handleSendReport}
          variant="primary"
          mode="contained"
          title={t('hotspot_settings.diagnostics.send_to_support')}
        />
      </Box>
    </ScrollView>
  )
}

export default HotspotDiagnosticReport
