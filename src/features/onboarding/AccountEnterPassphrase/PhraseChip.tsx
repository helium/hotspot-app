/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react'
import { upperFirst } from 'lodash'
import { TouchableHighlight, TouchableHighlightProps } from 'react-native'
import { createBox, useTheme } from '@shopify/restyle'
import Text from '../../../components/Text'
import { Theme } from '../../../theme/theme'

const BaseButton = createBox<
  Theme,
  TouchableHighlightProps & {
    children: React.ReactNode
  }
>(TouchableHighlight)

type Props = Omit<React.ComponentProps<typeof BaseButton>, 'children'> & {
  title: string
  selected?: boolean
}

const PhraseChip = ({ title, selected }: Props) => {
  const theme = useTheme<Theme>()
  const [underlayShowing, setUnderlayShowing] = useState(false)

  return (
    <BaseButton
      backgroundColor={selected ? 'lightBlue' : 'disabled'}
      onPress={() => {}}
      borderRadius="s"
      underlayColor={theme.colors.lightBlue}
      disabled={selected}
      onHideUnderlay={() => setUnderlayShowing(false)}
      onShowUnderlay={() => setUnderlayShowing(true)}
    >
      <Text
        paddingVertical="s"
        paddingHorizontal="m"
        variant="body"
        color={selected || underlayShowing ? 'mainBackground' : 'midGray'}
      >
        {upperFirst(title)}
      </Text>
    </BaseButton>
  )
}

export default PhraseChip
