/* eslint-disable react/jsx-props-no-spreading */
import React, { memo } from 'react'
import Close from '@assets/images/closeModal.svg'
import {
  DebouncedTouchableOpacityBox,
  TouchableOpacityBoxProps,
} from './TouchableOpacityBox'
import { useColors } from '../theme/themeHooks'
import { Colors } from '../theme/theme'

const CloseButton = (
  props: TouchableOpacityBoxProps & { buttonColor?: Colors },
) => {
  const colors = useColors()
  return (
    <DebouncedTouchableOpacityBox padding="xs" {...props}>
      <Close color={colors[props.buttonColor || 'white']} />
    </DebouncedTouchableOpacityBox>
  )
}

export default memo(CloseButton)
