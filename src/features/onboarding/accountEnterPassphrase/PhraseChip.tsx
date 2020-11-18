/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react'
import { upperFirst } from 'lodash'
import { useTheme } from '@shopify/restyle'
import Text from '../../../components/Text'
import { Theme } from '../../../theme/theme'
import TouchableHighlightBox, {
  TouchableHighlightBoxProps,
} from '../../../components/TouchableHighlightBox'

type Props = Omit<TouchableHighlightBoxProps, 'children'> & {
  title: string
  selected?: boolean
}

const PhraseChip = ({ title, selected, ...props }: Props) => {
  const theme = useTheme<Theme>()
  const [underlayShowing, setUnderlayShowing] = useState(false)

  return (
    <TouchableHighlightBox
      backgroundColor={selected ? 'lightBlue' : 'disabled'}
      onPress={() => {}}
      borderRadius="s"
      underlayColor={theme.colors.lightBlue}
      disabled={selected}
      onHideUnderlay={() => setUnderlayShowing(false)}
      onShowUnderlay={() => setUnderlayShowing(true)}
      {...props}
    >
      <Text
        paddingVertical="s"
        paddingHorizontal="m"
        variant="bodyMono"
        color={selected || underlayShowing ? 'mainBackground' : 'midGray'}
      >
        {upperFirst(title)}
      </Text>
    </TouchableHighlightBox>
  )
}

export default PhraseChip
