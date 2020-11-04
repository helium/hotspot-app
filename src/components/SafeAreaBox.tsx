import { createBox } from '@shopify/restyle'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Theme } from '../theme/theme'

const SafeAreaBox = createBox<Theme, React.ComponentProps<typeof SafeAreaView>>(
  SafeAreaView,
)

export default SafeAreaBox
