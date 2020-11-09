/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { BoxProps } from '@shopify/restyle'

import Text from './Text'
import { Theme } from '../theme/theme'
import Box from './Box'
import BackArrow from '../assets/images/backArrow.svg'
import { t } from '../utils/translate'

type Props = BoxProps<Theme> & {
  onPress?: () => void
}

const BackButton = ({ onPress, ...props }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        {...props}
        alignSelf="flex-start"
        padding="s"
        alignItems="center"
        flexDirection="row"
      >
        <BackArrow />
        <Text marginLeft="xs" color="steelGray" variant="button">
          {t('back')}
        </Text>
      </Box>
    </TouchableOpacity>
  )
}

export default BackButton
