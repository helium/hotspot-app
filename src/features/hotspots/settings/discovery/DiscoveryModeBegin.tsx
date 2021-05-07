import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { Hotspot } from '@helium/http'
import Text from '../../../../components/Text'
import { hp } from '../../../../utils/layout'
import Box from '../../../../components/Box'
import DiscoveryIcon from '../../../../assets/images/discovery_mode_icon.svg'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import Close from '../../../../assets/images/closeModal.svg'
import {
  DiscoveryRequest,
  RecentDiscoveryInfo,
} from '../../../../store/discovery/discoveryTypes'
import DiscoveryModeSessionInfo from './DiscoveryModeSessionInfo'
import animateTransition from '../../../../utils/animateTransition'
import useAlert from '../../../../utils/useAlert'
import { useColors } from '../../../../theme/themeHooks'
import DiscoveryModeLocationOptions, {
  DiscoveryLocationOption,
} from './DiscoveryModeLocationOptions'

type Props = {
  onClose: () => void
  recentDiscoveryInfo?: RecentDiscoveryInfo | null
  onBeginNew: (coords: number[]) => void
  onRequestSelected: (request: DiscoveryRequest) => void
  error: boolean
  hotspot: Hotspot
  hotspotCoordsValid: boolean
}

const DiscoveryModeBegin = ({
  onClose,
  recentDiscoveryInfo,
  onBeginNew,
  onRequestSelected,
  error,
  hotspot,
  hotspotCoordsValid,
}: Props) => {
  const { t } = useTranslation()
  const [hasInfo, setHasInfo] = useState(false)
  const [locationOption, setLocationOption] = useState<DiscoveryLocationOption>(
    hotspotCoordsValid ? 'asserted' : 'hotspot',
  )
  const { showOKAlert } = useAlert()
  const [alertShown, setAlertShown] = useState(false)
  const colors = useColors()

  useEffect(() => {
    if (hasInfo !== !!recentDiscoveryInfo) {
      animateTransition('DiscoveryModeBegin.HasInfo')
      setHasInfo(!!recentDiscoveryInfo)
    }
  }, [hasInfo, recentDiscoveryInfo])

  useEffect(() => {
    if (alertShown || !error) return

    setAlertShown(true)

    const showError = async () => {
      await showOKAlert({
        messageKey: 'discovery.begin.error.subtitle',
        titleKey: 'discovery.begin.error.title',
      })
      onClose()
    }
    showError()
  }, [showOKAlert, error, onClose, alertShown])

  const handleNewSession = useCallback(async () => {
    const useAssLoc = locationOption === 'asserted'
    onBeginNew([
      useAssLoc && hotspot.lng ? hotspot.lng : 0,
      useAssLoc && hotspot.lat ? hotspot.lat : 0,
    ])
  }, [hotspot.lat, hotspot.lng, locationOption, onBeginNew])

  return (
    <Box height={hp(85)}>
      <Box backgroundColor="purpleMain" height={260}>
        <Box
          paddingLeft="l"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="l"
        >
          <DiscoveryIcon color="white" height={29} width={40} />
          <TouchableOpacityBox padding="ms" onPress={onClose}>
            <Close color={colors.blackTransparent} />
          </TouchableOpacityBox>
        </Box>
        <Box
          width="100%"
          paddingHorizontal="l"
          paddingBottom={{ smallPhone: 'm', phone: 'lx' }}
          justifyContent="space-between"
          flex={1}
        >
          <Text variant="medium" fontSize={28} maxFontSizeMultiplier={1}>
            {t('discovery.begin.title')}
          </Text>
          <Text variant="light" fontSize={16} maxFontSizeMultiplier={1.1}>
            {t('discovery.begin.subtitle')}
          </Text>
          {recentDiscoveryInfo && (
            <Text
              variant="regular"
              fontSize={14}
              color="purpleDark"
              maxFontSizeMultiplier={1.2}
            >
              {t('discovery.begin.body', {
                requestsPerDay: recentDiscoveryInfo.requestsPerDay,
              })}
            </Text>
          )}
        </Box>
      </Box>
      <DiscoveryModeLocationOptions
        onValueChanged={setLocationOption}
        value={locationOption}
        hotspotCoordsValid={hotspotCoordsValid}
      />
      <Box margin="l" flex={1}>
        {hasInfo && recentDiscoveryInfo && (
          <DiscoveryModeSessionInfo
            onBeginNew={handleNewSession}
            onRequestSelected={onRequestSelected}
            requestsRemaining={recentDiscoveryInfo.requestsRemaining}
            requests={recentDiscoveryInfo.recentRequests}
            hotspotAddress={hotspot.address}
          />
        )}
        {!hasInfo && !error && (
          <Box flex={1} alignItems="center" justifyContent="center">
            <ActivityIndicator color="gray" />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default memo(DiscoveryModeBegin)
