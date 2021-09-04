import React, { useState, ReactElement } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import RNSwipeButton from 'rn-swipe-button'
import Box from './Box'

import { Font } from '../theme/theme'

function hexToRGB(hex: string, alpha?: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return alpha ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgba(${r}, ${g}, ${b})`
}

type SwipeButtonProps = {
  disabled?: boolean
  disabledColor?: string
  enabledColor?: string
  thumbColor?: string
  textColor?: string
  onSwipeSuccess?: () => void
  onSwipeSuccessDelay?: number
  title?: string
}

function SwipeButton({
  disabled = false,
  disabledColor = '#F59CA2',
  enabledColor = '#FF4949',
  onSwipeSuccess = () => {},
  onSwipeSuccessDelay,
  thumbColor = '#FFFFFF',
  textColor = '#FFFFFF',
  title,
}: SwipeButtonProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const containerStyle = {
    ...styles.container,
    backgroundColor: disabled ? disabledColor : enabledColor,
  }
  const textStyle = { ...styles.text, color: textColor }

  const onSuccess = () => {
    if (onSwipeSuccessDelay) {
      setIsLoading(true)
      setTimeout(onSwipeSuccess, onSwipeSuccessDelay)
    } else {
      onSwipeSuccess()
    }
  }
  return (
    <Box style={containerStyle}>
      <RNSwipeButton
        containerStyles={{ padding: 0, margin: 0 }}
        disabled={disabled}
        disabledThumbIconBackgroundColor={thumbColor}
        disabledThumbIconBorderColor="transparent"
        disabledRailBackgroundColor={disabledColor}
        height={42}
        onSwipeSuccess={onSuccess}
        railBackgroundColor={enabledColor}
        railBorderColor="transparent"
        railFillBackgroundColor={hexToRGB(enabledColor, 0.7)}
        railFillBorderColor="transparent"
        railStyles={{ borderRadius: 10 }}
        swipeSuccessThreshold={90}
        thumbIconBackgroundColor={thumbColor}
        thumbIconBorderColor="transparent"
        thumbIconComponent={
          isLoading
            ? ((ActivityIndicator as unknown) as ReactElement)
            : undefined
        }
        thumbIconStyles={{ borderRadius: 6 }}
        thumbIconWidth={32}
        title={title || t('generic.swipe_to_confirm')}
        titleStyles={textStyle}
        width="100%"
      />
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderRadius: 10,
  },
  text: {
    fontFamily: Font.main.regular,
    fontWeight: '500',
    fontSize: 16,
  },
})

export default SwipeButton
