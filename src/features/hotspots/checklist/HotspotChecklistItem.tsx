import React from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import Check from '../../../assets/images/checkPlain.svg'
import { useColors } from '../../../theme/themeHooks'

type Props = {
  title: string
  description: string
  complete?: boolean
  completeText?: string
  showAuto?: boolean
  autoText?: string
}

const HotspotChecklistItem = ({
  title,
  description,
  complete,
  completeText,
  showAuto,
  autoText,
}: Props) => {
  const { t } = useTranslation()
  const colors = useColors()
  const textColor = complete ? 'greenDarkText' : 'white'
  const backgroundColor = complete ? 'greenChecklist' : 'blueChecklist'
  const backgroundColorHex = complete
    ? colors.greenChecklist
    : colors.blueChecklist
  return (
    <Box>
      <Box
        padding="m"
        backgroundColor={backgroundColor}
        borderRadius="l"
        justifyContent="space-between"
        height={180}
      >
        <Box>
          <Box flexDirection="row" alignItems="center">
            <Box
              backgroundColor={textColor}
              borderRadius="s"
              padding="xs"
              opacity={showAuto ? 100 : 0}
            >
              <Text variant="bold" color={backgroundColor} fontSize={10}>
                {t('checklist.auto')}
              </Text>
            </Box>
            <Text
              variant="body2"
              color={textColor}
              paddingStart="s"
              fontSize={10}
            >
              {autoText}
            </Text>
          </Box>
          <Text variant="h3" marginTop="m" color={textColor}>
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
        <Box
          backgroundColor="white"
          borderRadius="s"
          padding="xs"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          opacity={complete ? 100 : 0}
          width={80}
        >
          <Check color={backgroundColorHex} />
          <Text
            variant="bold"
            color={backgroundColor}
            fontSize={10}
            paddingStart="xs"
          >
            {completeText || t('checklist.complete')}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default HotspotChecklistItem
