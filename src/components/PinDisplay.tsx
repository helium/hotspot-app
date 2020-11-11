/* eslint-disable react/jsx-props-no-spreading */
import { BoxProps } from '@shopify/restyle'
import React from 'react'
import { Theme } from '../theme/theme'
import Box from './Box'
import Dot from './Dot'

type Props = BoxProps<Theme>
const PinDisplay = (props: Props) => {
  return (
    <Box flexDirection="row" {...props}>
      {[...Array(6).keys()].map(() => (
        <Dot />
      ))}
    </Box>
  )
}

export default PinDisplay
