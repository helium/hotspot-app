/* eslint-disable import/prefer-default-export */
import qs from 'qs'
import Config from 'react-native-config'
import * as Logger from './logger'

const baseUrl = 'https://maps.googleapis.com/maps/api/place'
const apiKey = Config.GOOGLE_MAPS_API_KEY

const makeRequest = async (route: string, params = {}) => {
  const urlRoute = [baseUrl, route, 'json'].join('/')
  const url = [urlRoute, qs.stringify({ ...params, key: apiKey })].join('?')

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = new Error(
        `Bad response, status:${response.status} message:${response.statusText}`,
      )
      Logger.error(error)
      throw error
    }

    const text = await response.text()
    try {
      const json = JSON.parse(text)
      return json.data || json
    } catch (err) {
      return text
    }
  } catch (error) {
    Logger.breadcrumb('fetch failed')
    Logger.error(error)
    throw error
  }
}

export type AutocompleteSearchResult = {
  mainText: string
  secondaryText: string
  placeId: string
}

export const autocompleteAddress = async (
  searchTerm: string,
): Promise<AutocompleteSearchResult[]> => {
  const response = await makeRequest('autocomplete', { input: searchTerm })

  return response.predictions.map(
    (p: {
      place_id: string
      structured_formatting: { main_text: string; secondary_text: string }
    }) => ({
      mainText: p.structured_formatting.main_text,
      secondaryText: p.structured_formatting.secondary_text,
      placeId: p.place_id,
    }),
  )
}

export type PlaceGeography = {
  lat: number
  lng: number
}

export const getPlaceGeography = async (
  placeId: string,
): Promise<PlaceGeography> => {
  const response = await makeRequest('details', { placeid: placeId })
  return response.result.geometry.location
}

export type PlacePrediction = {
  description: string
  placeId: string
}
export const getCities = async (
  searchTerm: string,
): Promise<PlacePrediction[]> => {
  const response = await makeRequest('autocomplete', {
    input: searchTerm,
    type: '(cities)',
  })
  if ('predictions' in response) {
    return response.predictions.map(
      (p: { description: string; place_id: string }) => ({
        description: p.description,
        placeId: p.place_id,
      }),
    )
  }
  return []
}
