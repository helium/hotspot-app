import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Colors } from '../theme/theme'
import BackButton from './BackButton'
import SafeAreaBox from './SafeAreaBox'

type Props = { backgroundColor?: Colors; children?: React.ReactNode }
const BackScreen = ({ backgroundColor, children }: Props) => {
  const navigation = useNavigation()
  return (
    <SafeAreaBox
      backgroundColor={backgroundColor || 'secondaryBackground'}
      flex={1}
    >
      <BackButton onPress={navigation.goBack} />
      {children}
    </SafeAreaBox>
  )
}

export default BackScreen
