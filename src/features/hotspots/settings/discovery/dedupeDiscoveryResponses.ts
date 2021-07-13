import { DiscoveryResponse } from '../../../../store/discovery/discoveryTypes'

export default (responses: DiscoveryResponse[]) =>
  responses.filter(
    (response, index, allResponses) =>
      allResponses.findIndex(
        (responseB) => responseB.hotspotAddress === response.hotspotAddress,
      ) === index,
  )
