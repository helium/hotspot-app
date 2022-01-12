import React, { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { isEqual } from 'lodash'
import { useSelector } from 'react-redux'
import Emoji from 'react-native-emoji'
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
import { RootState } from '../../../../store/rootReducer'
import parseMarkup from '../../../../utils/parseMarkup'

type Props = {
  onClose: () => void
  recentDiscoveryInfo?: RecentDiscoveryInfo | null
  onBeginNew: () => void
  onRequestSelected: (request: DiscoveryRequest) => void
  error: boolean
}

const DiscoveryModeBegin = ({
  onClose,
  recentDiscoveryInfo,
  onBeginNew,
  onRequestSelected,
  error,
}: Props) => {
  const { t } = useTranslation()
  const [recentRequests, setRecentRequests] = useState(
    recentDiscoveryInfo?.recentRequests,
  )

  const { showOKAlert } = useAlert()
  const [alertShown, setAlertShown] = useState(false)
  const colors = useColors()
  const disabledMessage = useSelector(
    (state: RootState) => state.features.discovery.message,
  )
  const enabled = useMemo(() => recentDiscoveryInfo?.enabled, [
    recentDiscoveryInfo?.enabled,
  ])

  useEffect(() => {
    if (isEqual(recentDiscoveryInfo?.recentRequests, recentRequests)) return

    animateTransition('DiscoveryModeBegin.SetDiscoInfo')
    setRecentRequests(recentDiscoveryInfo?.recentRequests)
  }, [recentDiscoveryInfo?.recentRequests, recentRequests])

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

  const subtitle = useMemo(() => {
    const length = recentDiscoveryInfo?.requestLength || 0
    const seconds = length % 60
    const minutes = Math.floor(length / 60)

    let duration = ''
    if (minutes) {
      duration = t('generic.minutes', { count: minutes })
    }
    if (seconds) {
      duration = `${duration}${duration ? ' ' : ''}${t('generic.seconds', {
        count: seconds,
      })}`
    }
    return t('discovery.begin.subtitle', {
      duration,
    })
  }, [recentDiscoveryInfo?.requestLength, t])

  return (
    <Box height={hp(85)}>
      <Box backgroundColor="purpleMain" height={210}>
        <Box
          paddingLeft="l"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
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
          justifyContent="center"
          flex={1}
        >
          <Text
            variant="medium"
            fontSize={24}
            maxFontSizeMultiplier={1}
            marginBottom="m"
          >
            {t('discovery.begin.title')}
          </Text>
          <Text
            variant="regular"
            fontSize={16}
            maxFontSizeMultiplier={1.1}
            marginBottom="m"
          >
            {subtitle}
          </Text>
          {recentRequests && enabled && (
            <Text
              variant="regular"
              fontSize={14}
              color="white"
              maxFontSizeMultiplier={1.2}
            >
              {t('discovery.begin.body', {
                requestsPerDay: recentDiscoveryInfo?.requestsPerDay,
              })}
            </Text>
          )}
        </Box>
      </Box>
      {!enabled && (
        <Box
          flexDirection="row"
          backgroundColor="grayBox"
          justifyContent="center"
          alignItems="center"
          padding="m"
        >
          <Emoji name="construction" />
          <Text
            color="grayText"
            paddingLeft="s"
            fontSize={16}
            maxFontSizeMultiplier={1.1}
          >
            {t('discovery.begin.disabled')}
          </Text>
        </Box>
      )}
      <Box margin="l" marginTop="m" flex={1}>
        {!enabled &&
          disabledMessage &&
          parseMarkup(
            disabledMessage.replace(/\\n/g, '\n'),
            <Text
              variant="regular"
              fontSize={16}
              maxFontSizeMultiplier={1.1}
              color="black"
              marginBottom="m"
            />,
          )}
        {recentRequests && enabled && (
          <DiscoveryModeSessionInfo
            onBeginNew={onBeginNew}
            onRequestSelected={onRequestSelected}
            requestsRemaining={recentDiscoveryInfo?.requestsRemaining || 0}
            requests={recentRequests}
          />
        )}
        {!recentRequests && !error && (
          <Box flex={1} alignItems="center" justifyContent="center">
            <ActivityIndicator color="gray" />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default memo(DiscoveryModeBegin)
