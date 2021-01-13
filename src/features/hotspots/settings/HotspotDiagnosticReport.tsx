import React, { useEffect, useState } from 'react'
import { useAsync } from 'react-async-hook'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, LayoutAnimation } from 'react-native'
import { round } from 'lodash'
import { useSelector } from 'react-redux'
import { formatDistance, fromUnixTime, getUnixTime } from 'date-fns'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { RootState } from '../../../store/rootReducer'
import { useColors } from '../../../theme/themeHooks'
import DiagnosticAttribute from './DiagnosticAttribute'
import { fetchHotspotActivity } from '../../../store/connectedHotspot/connectedHotspotSlice'
import { useAppDispatch } from '../../../store/store'

const HotspotDiagnosticReport = () => {
  const { getDiagnosticInfo } = useConnectedHotspotContext()
  const { purpleMain } = useColors()
  const [loading, setLoading] = useState(true)
  const { result: diagnostics } = useAsync(getDiagnosticInfo, [])
  const { t } = useTranslation()
  const {
    connectedHotspot: {
      activity: {
        challenge_activity: { data: challenges },
      },
    },
  } = useSelector((state: RootState) => state)
  const dispatch = useAppDispatch()

  const height = parseInt(diagnostics?.height || '0', 10)

  // TODO: GET BLOCK HEIGHT
  const latestBlockHeight = 0 // client.blocks.getHeight()

  const lastChallenge = challenges.length > 0 ? challenges[0] : undefined

  const syncedRatio = height / latestBlockHeight
  const percentSynced = round(syncedRatio * 100, 2)
  const within500Blocks = height ? latestBlockHeight - height <= 500 : false
  const fullySynced = percentSynced === 100 || within500Blocks
  const currentTime = getUnixTime(new Date())
  const blockTimeErrorLimit = 24 * 60 * 60 // 24 hours
  const hasLastChallenge = lastChallenge !== null && lastChallenge !== undefined
  const lastChallengeTime = lastChallenge ? lastChallenge.time : 0

  useEffect(() => {
    dispatch(
      fetchHotspotActivity({ filter: 'challenge_activity', fetchCount: 1 }),
    )
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
          percent: fullySynced ? 100 : percentSynced,
        })}
        success={fullySynced}
      />

      <Text variant="h4" color="black" marginVertical="m">
        {t('hotspot_settings.diagnostics.last_challenged')}
      </Text>
      <DiagnosticAttribute
        text={
          hasLastChallenge
            ? formatDistance(fromUnixTime(lastChallengeTime), new Date(), {
                addSuffix: true,
              })
            : t('generic.unknown')
        }
        success={
          hasLastChallenge &&
          currentTime - lastChallengeTime < blockTimeErrorLimit
        }
      />
    </Box>
  )
}

export default HotspotDiagnosticReport
