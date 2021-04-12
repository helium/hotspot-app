import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import Check from '../../../assets/images/checkPlain.svg'
import BackgroundOne from '../../../assets/images/checklist-bg-1.svg'
import BackgroundTwo from '../../../assets/images/checklist-bg-2.svg'
import BackgroundThree from '../../../assets/images/checklist-bg-3.svg'
import BackgroundFour from '../../../assets/images/checklist-bg-4.svg'
import { useColors, useSpacing } from '../../../theme/themeHooks'
import { Colors } from '../../../theme/theme'
import { wp } from '../../../utils/layout'

type CompleteProps = {
  complete?: boolean
  colorString: Colors
  colorHex: string
  text: string
}
const CompletePill = ({
  complete,
  colorString,
  colorHex,
  text,
}: CompleteProps) => (
  <Box
    backgroundColor="white"
    borderRadius="s"
    padding="xs"
    flexDirection="row"
    alignItems="center"
    justifyContent="center"
    opacity={complete ? 100 : 0}
  >
    <Check color={colorHex} />
    <Text variant="bold" color={colorString} fontSize={10} paddingStart="xs">
      {text}
    </Text>
  </Box>
)

type AutoProps = {
  textColor: Colors
  showAuto?: boolean
  backgroundColor: Colors
  autoText?: string
  auto: string
}
const AutoPill = ({
  textColor,
  showAuto,
  backgroundColor,
  autoText,
  auto,
}: AutoProps) => (
  <Box flexDirection="row" alignItems="center">
    <Box
      backgroundColor={textColor}
      borderRadius="s"
      padding="xs"
      opacity={showAuto ? 100 : 0}
    >
      <Text variant="bold" color={backgroundColor} fontSize={10}>
        {auto}
      </Text>
    </Box>
    <Text variant="body2" color={textColor} paddingStart="s" fontSize={10}>
      {autoText}
    </Text>
  </Box>
)

type Props = {
  title: string
  description: string
  complete?: boolean
  completeText?: string
  showAuto?: boolean
  autoText?: string
  background?: 1 | 2 | 3 | 4
  isAndroid: boolean
}
const HotspotChecklistItem = ({
  title,
  description,
  complete,
  completeText,
  showAuto,
  autoText,
  background,
  isAndroid,
}: Props) => {
  const { t } = useTranslation()
  const colors = useColors()
  const spacing = useSpacing()
  const textColor = complete ? 'greenDarkText' : 'white'
  const backgroundColor = complete ? 'greenChecklist' : 'purpleMain'
  const backgroundColorHex = complete
    ? colors.greenChecklist
    : colors.purpleMain

  const Background = useCallback(() => {
    switch (background) {
      default:
      case 1:
        return (
          <Box position="absolute" right={spacing.s} top={-30}>
            <BackgroundOne
              color={complete ? colors.greenDarkText : '#898DFF'}
            />
          </Box>
        )
      case 2:
        return (
          <Box position="absolute" right={spacing.s} top={-24}>
            <BackgroundTwo
              color={complete ? colors.greenDarkText : '#898DFF'}
            />
          </Box>
        )
      case 3:
        return (
          <Box position="absolute" right={spacing.s} top={-24}>
            <BackgroundThree
              color={complete ? colors.greenDarkText : 'white'}
            />
          </Box>
        )
      case 4:
        return (
          <Box position="absolute" right={-5} top={-55}>
            <BackgroundFour
              color={complete ? colors.greenDarkText : colors.white}
            />
          </Box>
        )
    }
  }, [background, colors.greenDarkText, colors.white, complete, spacing.s])

  return (
    <Box
      marginHorizontal={isAndroid ? undefined : 'xs'}
      width={isAndroid ? wp(100) : undefined}
      paddingHorizontal={isAndroid ? 'm' : undefined}
    >
      <Box
        padding="m"
        backgroundColor={backgroundColor}
        borderRadius="l"
        justifyContent="space-between"
        height={180}
        overflow="hidden"
      >
        <Background />
        <Box>
          <AutoPill
            textColor={textColor}
            showAuto={showAuto}
            backgroundColor={backgroundColor}
            autoText={autoText}
            auto={t('checklist.auto')}
          />
          <Text variant="h3" marginTop="l" color={textColor} paddingTop="xs">
            {title}
          </Text>
          <Text
            variant="body2"
            marginTop="s"
            marginBottom="m"
            color={textColor}
          >
            {description}
          </Text>
        </Box>
        <Box flexDirection="row">
          <CompletePill
            complete={complete}
            colorHex={backgroundColorHex}
            colorString={backgroundColor}
            text={completeText || t('checklist.complete')}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default memo(HotspotChecklistItem)
