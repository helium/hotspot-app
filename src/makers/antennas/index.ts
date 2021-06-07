import bobcat from './bobcat'
import custom from './custom'
import finestra from './finestra'
import helium from './helium'
import longAP from './longAP'
import nebra from './nebra'
import rak from './rak'
import syncrobit from './syncrobit'

export const AntennaModels = {
  ...bobcat,
  ...custom,
  ...finestra,
  ...helium,
  ...longAP,
  ...nebra,
  ...rak,
  ...syncrobit,
}

export type AntennaType = keyof typeof AntennaModels
export const AntennaModelKeys = Object.keys(
  AntennaModels,
).sort() as AntennaType[]
export const AntennaTypeCount = AntennaModelKeys.length
