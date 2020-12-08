import React, { useRef, useEffect } from 'react'
import { Animated } from 'react-native'
import Word from './Word'
import Box from './Box'

type Props = { words: Array<string>; onPressWord?: (idx: number) => () => void }

const WordList = ({ words, onPressWord }: Props) => {
  const opacity = useRef(new Animated.Value(0))
  useEffect(() => {
    Animated.timing(opacity.current, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words])

  return (
    <Box
      backgroundColor="primaryBackground"
      flexDirection="row"
      minHeight={180}
      alignContent="space-between"
      paddingVertical="m"
    >
      <Box flex={1} paddingHorizontal="lx">
        {words.slice(0, 6).map((word, idx) => (
          <Word
            key={`${word}.${idx + 1}`}
            position={idx + 1}
            word={word}
            onPress={onPressWord?.(idx)}
            opacity={opacity.current}
          />
        ))}
      </Box>
      <Box flex={1} paddingHorizontal="lx">
        {words.slice(6).map((word, idx) => (
          <Word
            key={`${word}.${idx + 7}`}
            position={idx + 7}
            word={word}
            onPress={onPressWord?.(idx + 6)}
            opacity={opacity.current}
          />
        ))}
      </Box>
    </Box>
  )
}

export default WordList
