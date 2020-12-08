/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react'
import { upperFirst } from 'lodash'
import Text from '../../../components/Text'
import TouchableHighlightBox, {
  TouchableHighlightBoxProps,
} from '../../../components/TouchableHighlightBox'
import { useColors } from '../../../theme/themeHooks'

type Props = Omit<TouchableHighlightBoxProps, 'children'> & {
  title: string
  selected?: boolean
}

const PhraseChip = ({ title, selected, ...props }: Props) => {
  const { lightBlue } = useColors()
  const [underlayShowing, setUnderlayShowing] = useState(false)

  return (
    <TouchableHighlightBox
      backgroundColor={selected ? 'lightBlue' : 'disabled'}
      onPress={() => {}}
      borderRadius="s"
      underlayColor={lightBlue}
      disabled={selected}
      onHideUnderlay={() => setUnderlayShowing(false)}
      onShowUnderlay={() => setUnderlayShowing(true)}
      {...props}
    >
      <Text
        paddingVertical="s"
        paddingHorizontal="m"
        variant="body2Mono"
        color={selected || underlayShowing ? 'primaryBackground' : 'midGray'}
      >
        {upperFirst(title)}
      </Text>
    </TouchableHighlightBox>
  )
}

export default PhraseChip
