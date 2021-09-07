/* eslint-disable react/jsx-props-no-spreading */
import { Hotspot, Validator, Witness } from '@helium/http'
import { BoxProps } from '@shopify/restyle'
import React, { useState, useEffect, memo, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Close from '@assets/images/close.svg'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { Colors, Theme } from '../../../theme/theme'
import { useColors } from '../../../theme/themeHooks'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import animateTransition from '../../../utils/animateTransition'
import usePrevious from '../../../utils/usePrevious'
import useHotspotSync from '../useHotspotSync'

type Props = BoxProps<Theme> & {
  hotspot?: Hotspot | Witness | Validator
  visible: boolean
  onDismiss: () => void
  title?: string
  subtitle?: string
  backgroundColor?: Colors
  textColor?: Colors
}
const HotspotStatusBanner = ({
  hotspot,
  visible: propsVisible,
  onDismiss,
  title,
  subtitle,
  backgroundColor = 'orangeDark',
  textColor = 'orangeExtraDark',
  ...boxProps
}: Props) => {
  const { t } = useTranslation()
  const colors = useColors()
  const [visible, setVisible] = useState(false)
  const prevHotspotAddress = usePrevious(hotspot?.address)

  const { getStatusMessage } = useHotspotSync(hotspot)

  useEffect(() => {
    if (visible === propsVisible) return
    animateTransition('HotspotStatusBanner')
    setVisible(propsVisible)
  }, [propsVisible, visible])

  useEffect(() => {
    if (prevHotspotAddress === hotspot?.address || !visible) return

    onDismiss()
  }, [hotspot?.address, onDismiss, prevHotspotAddress, visible])

  const titleText = useMemo(() => {
    if (title !== undefined) return title

    if (hotspot?.status?.online === 'online') {
      return t('hotspot_details.status_prompt_online.title')
    }
    return t('hotspot_details.status_prompt_offline.title')
  }, [hotspot?.status?.online, t, title])

  const handleClose = useCallback(() => {
    onDismiss()
  }, [onDismiss])

  const subtitleText = useMemo(() => {
    if (subtitle !== undefined) return subtitle

    if (hotspot?.status?.online !== 'online') return null

    return getStatusMessage()
  }, [getStatusMessage, hotspot?.status?.online, subtitle])

  if (!visible) return null

  return (
    <Box
      {...boxProps}
      paddingHorizontal="l"
      paddingVertical="ms"
      justifyContent="center"
    >
      <Box
        position="absolute"
        backgroundColor={backgroundColor}
        opacity={0.17}
        top={0}
        left={0}
        right={0}
        bottom={0}
      />
      {!!titleText && (
        <Text variant="bold" fontSize={15} lineHeight={21} color={textColor}>
          {titleText}
        </Text>
      )}
      {!!subtitleText && (
        <Text
          variant="regular"
          fontSize={15}
          lineHeight={21}
          color={textColor}
          marginRight="l"
        >
          {subtitleText}
        </Text>
      )}
      <TouchableOpacityBox
        onPress={handleClose}
        position="absolute"
        right={0}
        top={0}
        bottom={0}
        justifyContent="center"
        paddingHorizontal="l"
      >
        <Close color={colors[textColor]} height={14} width={14} />
      </TouchableOpacityBox>
    </Box>
  )
}

export default memo(HotspotStatusBanner)
