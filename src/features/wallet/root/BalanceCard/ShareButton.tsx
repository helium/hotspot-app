import React from 'react'
import { Share, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import ShareImg from '@assets/images/share.svg'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import useHaptic from '../../../../utils/useHaptic'

const ShareButton = ({ address }: { address: string }) => {
  const { t } = useTranslation()
  const { triggerNavHaptic } = useHaptic()

  const handlePress = () => {
    Share.share({ message: address })
    triggerNavHaptic()
  }

  return (
    <TouchableOpacityBox onPress={handlePress} borderRadius="round">
      <Box
        backgroundColor="purple300"
        borderRadius="round"
        paddingVertical="ms"
        paddingHorizontal="m"
        flexDirection="row"
        alignItems="center"
        marginTop="s"
      >
        <View style={{ marginBottom: 2, marginRight: 6 }}>
          <ShareImg width={18} height={18} />
        </View>
        <Text variant="body1">{t('wallet.share')}</Text>
      </Box>
    </TouchableOpacityBox>
  )
}

export default ShareButton
