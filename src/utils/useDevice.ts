import { useState } from 'react'
import { getVersion } from 'react-native-device-info'

export default () => {
  const [version] = useState(getVersion())
  return { version }
}
