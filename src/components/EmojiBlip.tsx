import React, { memo } from 'react'
import Blip from '@assets/images/blip.svg'
import Emoji from 'react-native-emoji'
import { sample } from 'lodash'
import Box from './Box'

const emojis = {
  morning: ['coffee', 'fried_egg'],
  lunch: ['burrito', 'taco', 'pizza'],
  evening: ['sleeping', 'night_with_stars', 'waning_gibbous_moon'],
  anytime: [
    'stuck_out_tongue_winking_eye',
    'rocket',
    'balloon',
    '100',
    'grin',
    'the_horns',
    'star2',
    'tada',
    'rainbow',
  ],
}

const EmojiBlip = ({ date }: { date: Date }) => {
  const emojiOptions = [...emojis.anytime]
  const hour = date.getHours()

  if (hour >= 4 && hour < 12) {
    emojiOptions.push(...emojis.morning)
  }
  if (hour >= 12 && hour < 15) {
    emojiOptions.push(...emojis.lunch)
  }
  if (hour >= 18 || hour < 4) {
    emojiOptions.push(...emojis.evening)
  }

  const emojiName = sample(emojiOptions) || '100'

  return (
    <Box width={70} marginBottom="m">
      <Blip width={70} />
      <Box
        position="absolute"
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Emoji name={emojiName} style={{ fontSize: 28 }} />
      </Box>
    </Box>
  )
}

export default memo(EmojiBlip)
