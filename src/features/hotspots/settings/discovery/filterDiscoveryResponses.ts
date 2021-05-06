import { DiscoveryResponse } from '../../../../store/discovery/discoveryTypes'

export default (hotspotAddress: string, responses: DiscoveryResponse[]) => {
  const filtered = responses.filter((response, index, allResponses) => {
    if (response.hotspotAddress === hotspotAddress) return false

    return (
      allResponses.findIndex(
        (responseB) => responseB.hotspotAddress === response.hotspotAddress,
      ) === index
    )
  })

  return filtered
}
