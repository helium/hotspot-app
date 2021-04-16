import { LayoutAnimation, Platform } from 'react-native'

export default (enabledOnAndroid = true) => {
  if (Platform.OS === 'android' && !enabledOnAndroid) return

  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
}
