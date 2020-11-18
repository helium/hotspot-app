import { createBox } from '@shopify/restyle'
import { capitalize } from 'lodash'
import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import Text from '../../../components/Text'
import { Theme } from '../../../theme/theme'

type WordProps = {
  fullWord: string
  matchingText: string
  onPress: (fullWord: string) => void
}

const BaseButton = createBox<
  Theme,
  TouchableOpacityProps & {
    children: React.ReactNode
  }
>(TouchableOpacity)

type Props = Omit<
  React.ComponentProps<typeof BaseButton>,
  'children' | 'onPress'
> &
  WordProps

const MatchingWord = ({ fullWord, matchingText, onPress }: Props) => (
  <BaseButton
    justifyContent="center"
    alignContent="center"
    marginRight="s"
    // height={{ smallPhone: 54, phone: 40 }}
    padding={{ smallPhone: 'm', phone: 'ms' }}
    borderRadius="m"
    backgroundColor="lighterGray"
    onPress={() => onPress(fullWord)}
  >
    <Text
      variant="bodyMono"
      justifyContent="center"
      alignContent="center"
      color="white"
    >
      {capitalize(matchingText)}
      <Text
        variant="bodyMono"
        alignContent="center"
        justifyContent="center"
        color="midGray"
      >
        {fullWord.slice(matchingText.length)}
      </Text>
    </Text>
  </BaseButton>
)

export default MatchingWord
