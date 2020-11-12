import { Platform } from 'react-native'
import * as Haptics from 'expo-haptics'

export default () => {
  if (Platform.OS === 'ios') {
    Haptics.impactAsync()
  }
}
