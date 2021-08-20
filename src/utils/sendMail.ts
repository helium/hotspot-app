import Mailer from 'react-native-mail'
import { error } from './logger'

export default ({
  subject,
  body,
  isHTML,
  recipients,
}: {
  subject: string
  body: string
  isHTML: boolean
  recipients?: string[]
}) =>
  Mailer.mail(
    {
      subject,
      body,
      isHTML,
      recipients,
    },
    error,
  )
