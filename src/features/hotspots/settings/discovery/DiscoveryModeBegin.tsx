import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
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

type Props = {
  onClose: () => void
  recentDiscoveryInfo?: RecentDiscoveryInfo | null
  onBeginNew: () => void
  onRequestSelected: (request: DiscoveryRequest) => void
  error: boolean
  hotspotAddress: string
}
const DiscoveryModeBegin = ({
  onClose,
  recentDiscoveryInfo,
  onBeginNew,
  onRequestSelected,
  error,
  hotspotAddress,
}: Props) => {
  const { t } = useTranslation()
  const [hasInfo, setHasInfo] = useState(false)
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

  return (
    <Box height={Math.min(640, hp(85))}>
      <Box flex={273} backgroundColor="purpleMain" alignItems="flex-end">
        <TouchableOpacityBox padding="ms" onPress={onClose}>
          <Close color={colors.blackTransparent} />
        </TouchableOpacityBox>
        <Box
          width="100%"
          paddingHorizontal="l"
          paddingBottom={{ smallPhone: 'm', phone: 'lx' }}
          justifyContent="space-between"
          flex={1}
        >
          <DiscoveryIcon color="white" height={29} width={40} />
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
      <Box flex={367} margin="l">
        {hasInfo && recentDiscoveryInfo && (
          <DiscoveryModeSessionInfo
            onBeginNew={onBeginNew}
            onRequestSelected={onRequestSelected}
            requestsRemaining={recentDiscoveryInfo.requestsRemaining}
            requests={recentDiscoveryInfo.recentRequests}
            hotspotAddress={hotspotAddress}
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
