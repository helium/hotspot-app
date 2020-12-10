/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { BoxProps } from '@shopify/restyle'
import { useTranslation } from 'react-i18next'
import Text from './Text'
import { Theme } from '../theme/theme'
import BackArrow from '../assets/images/backArrow.svg'
import TouchableOpacityBox from './TouchableOpacityBox'

type Props = BoxProps<Theme> & {
  onPress?: () => void
}

const BackButton = ({ onPress, ...props }: Props) => {
  const { t } = useTranslation()
  return (
    <TouchableOpacityBox
      onPress={onPress}
      alignSelf="flex-start"
      paddingVertical="s"
      paddingHorizontal="lx"
      alignItems="center"
      flexDirection="row"
      {...props}
    >
      <BackArrow height={16} width={16} />
      <Text marginLeft="xs" color="primaryText" variant="bold" fontSize={22}>
        {t('back')}
      </Text>
    </TouchableOpacityBox>
  )
}

export default BackButton
