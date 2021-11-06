import React from 'react'
import createText from '../utils/createText'
import { Theme } from '../theme/theme'

const Text = createText<Theme>()

export default Text

export type TextProps = React.ComponentProps<typeof Text>
