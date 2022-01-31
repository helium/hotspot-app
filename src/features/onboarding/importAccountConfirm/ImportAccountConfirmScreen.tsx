import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import Lock from '@assets/images/lock_ico.svg'
import { upperCase } from 'lodash'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import {
  OnboardingNavigationProp,
  OnboardingStackParamList,
} from '../onboardingTypes'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Button from '../../../components/Button'
import BackScreen from '../../../components/BackScreen'
import { wp } from '../../../utils/layout'
import Card from '../../../components/Card'
import ImportReplaceWordModal from './ImportReplaceWordModal'

type Route = RouteProp<OnboardingStackParamList, 'ImportAccountConfirmScreen'>
const ImportAccountConfirmScreen = () => {
  const { t } = useTranslation()
  const [selectedWordIdx, setSelectedWordIdx] = useState<number | null>(null)
  const [words, setWords] = useState<Array<string>>([])
  const navigation = useNavigation<OnboardingNavigationProp>()
  const {
    params: { words: routeWords },
  } = useRoute<Route>()
  const [wordIndex, setWordIndex] = useState(0)

  const onSnapToItem = (index: number) => {
    setWordIndex(index)
  }

  const navNext = useCallback(
    () => navigation.push('AccountImportCompleteScreen', { words }),
    [navigation, words],
  )

  useEffect(() => {
    setWords(routeWords)
  }, [routeWords])

  const clearSelection = () => setSelectedWordIdx(null)

  const handleWordEdit = (idx: number) => () => setSelectedWordIdx(idx)

  const replaceWord = (newWord: string, idx: number) => {
    clearSelection()

    setWords((prevWords) => {
      const nextWords = [...prevWords]
      nextWords[idx] = newWord
      return nextWords
    })
  }

  const renderItem = useCallback(
    ({ item, index }) => {
      const isFirst = index === 0
      const isLast = index + 1 === routeWords?.length
      return (
        <TouchableOpacityBox
          height={{ smallPhone: 84, phone: 114 }}
          onPress={handleWordEdit(index)}
        >
          <Card
            marginHorizontal="s"
            marginLeft={isFirst ? 'l' : undefined}
            marginRight={isLast ? 'l' : undefined}
            variant="elevated"
            flex={1}
            overflow="hidden"
            backgroundColor="white"
            paddingHorizontal="l"
            alignItems="center"
            flexDirection="row"
          >
            <Text
              variant="bold"
              fontSize={39}
              color="purpleLight"
              maxFontSizeMultiplier={1}
            >{`${index + 1}. `}</Text>
            <Text
              variant="bold"
              fontSize={39}
              color="purpleDark"
              maxFontSizeMultiplier={1}
            >
              {upperCase(item)}
            </Text>
          </Card>
        </TouchableOpacityBox>
      )
    },
    [routeWords?.length],
  )

  return (
    <BackScreen>
      <Box>
        <Lock />
        <Text
          marginTop="l"
          variant="bold"
          fontSize={27}
          numberOfLines={2}
          maxFontSizeMultiplier={1}
          adjustsFontSizeToFit
          marginBottom="s"
        >
          {t('account_import.confirm.title')}
        </Text>
        <Text
          variant="light"
          color="grayLight"
          fontSize={20}
          maxFontSizeMultiplier={1.1}
        >
          {t('account_import.confirm.subtitle')}
        </Text>
      </Box>
      <Box marginHorizontal="n_lx" marginVertical="l">
        <Carousel
          layout="default"
          vertical={false}
          data={words}
          renderItem={renderItem}
          sliderWidth={wp(100)}
          itemWidth={wp(90)}
          inactiveSlideScale={1}
          onScrollIndexChanged={onSnapToItem}
          useExperimentalSnap
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore this is a new beta prop and enforces only scrolling one item at a time
          disableIntervalMomentum
        />
        <Pagination
          containerStyle={styles.dotContainer}
          dotsLength={words.length}
          activeDotIndex={wordIndex}
          dotStyle={styles.dots}
          inactiveDotOpacity={0.4}
          inactiveDotScale={1}
        />
      </Box>
      <Box
        paddingHorizontal="l"
        paddingBottom="l"
        flex={3}
        justifyContent="flex-end"
      >
        <Button
          height={60}
          onPress={navNext}
          variant="primary"
          mode="contained"
          title={t('account_import.confirm.next')}
        />
      </Box>
      <ImportReplaceWordModal
        visible={selectedWordIdx !== null}
        onRequestClose={clearSelection}
        onSelectWord={replaceWord}
        wordIdx={selectedWordIdx ?? 0}
      />
    </BackScreen>
  )
}

const styles = StyleSheet.create({
  dots: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  dotContainer: { marginTop: 24 },
})

export default ImportAccountConfirmScreen
