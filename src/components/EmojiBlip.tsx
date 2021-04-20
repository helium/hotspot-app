import React, { memo, useCallback, useMemo } from 'react'
import Emoji from 'react-native-emoji'
import { sample } from 'lodash'
import { StyleSheet } from 'react-native'

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

const EmojiBlip = ({ date, name }: { date?: Date; name?: string }) => {
  const pickEmoji = useCallback(() => {
    if (!date) return '100'

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

    return sample(emojiOptions)
  }, [date])

  const emojiName = useMemo(() => name || pickEmoji() || '100', [
    name,
    pickEmoji,
  ])

  return <Emoji name={emojiName} style={styles.emoji} />
}

const styles = StyleSheet.create({ emoji: { fontSize: 42 } })

export default memo(EmojiBlip)
