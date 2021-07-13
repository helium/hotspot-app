import { uniqBy } from 'lodash'
import { DiscoveryResponse } from '../../../../store/discovery/discoveryTypes'

export default (responses: DiscoveryResponse[]) =>
  uniqBy(responses, ({ hotspotAddress }) => hotspotAddress)
