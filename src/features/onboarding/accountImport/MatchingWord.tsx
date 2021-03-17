import { capitalize } from 'lodash'
import React from 'react'
import TouchableOpacityBox, {
  TouchableOpacityBoxProps,
} from '../../../components/TouchableOpacityBox'
import Text from '../../../components/Text'

type WordProps = {
  fullWord: string
  matchingText: string
  onPress: (fullWord: string) => void
}

type Props = Omit<TouchableOpacityBoxProps, 'children' | 'onPress'> & WordProps

const MatchingWord = ({ fullWord, matchingText, onPress }: Props) => (
  <TouchableOpacityBox
    justifyContent="center"
    alignContent="center"
    marginRight="s"
    paddingHorizontal={{ smallPhone: 'm', phone: 'ms' }}
    borderRadius="m"
    backgroundColor="purple200"
    onPress={() => onPress(fullWord)}
    height={40}
  >
    <Text
      variant="body1Medium"
      justifyContent="center"
      alignContent="center"
      color="white"
    >
      {capitalize(matchingText)}
      <Text
        variant="body1Medium"
        alignContent="center"
        justifyContent="center"
        color="grayMain"
      >
        {fullWord.slice(matchingText.length)}
      </Text>
    </Text>
  </TouchableOpacityBox>
)

export default MatchingWord
