//
//  HeliumHotspotsWidgetAPI.swift
//  HeliumWidgetExtension
//
//  Created by Luis F. Perrone on 2/15/22.
//

import Foundation

struct HotspotsRewardsData: Decodable {
  var gateway: String
  var total: Double
}

struct HotspotStatusesData: Decodable {
  var data: [HotspotStatusData]
}

struct HotspotStatusData: Decodable {
  var address: String
  var geocode: HotspotGeocodeData
  var name: String
  var status: StatusData
}

struct HotspotGeocodeData: Decodable {
  var long_street: String
  var short_city: String
  var short_country: String
}


/**
 * Fetch hotspots widget data using both hotspot rewards & hotspot statuses endpoints.
 */
func fetchHotspotsWidgetData(hotspotsWidgetData: HotspotsWidgetData, completion: @escaping (Error?, HotspotsWidgetData) -> Void) {
  fetchHotspotRewards(hotspotsWidgetData: hotspotsWidgetData) { error, hotspotsRewardsData in
    if (error == nil) {
      fetchHotspotStatuses(hotspotsWidgetData: hotspotsWidgetData) { error, hotspotStatusesData in
        if (error == nil) {
          
          // Get hotspots data array
          var hotspots: [HotspotData] = []
          hotspotStatusesData?.data.forEach({ status in
            let geocodeData = GeoCodeData(longStreet: status.geocode.long_street, shortCity: status.geocode.short_city, shortCountry: status.geocode.short_country)
            hotspots.append(HotspotData(name: status.name, geocode: geocodeData, address: status.address, status: StatusData(online: status.status.online)))
          })
          
          // Get rewards data array
          var rewards: [RewardsData] = []
          hotspotsRewardsData?.forEach({ reward in
            rewards.append(RewardsData(address: reward.gateway, reward: RewardData(floatBalance: reward.total)))
          })
          
          let parsedHotspotsWidgetData = HotspotsWidgetData(hotspots: hotspots, rewards: rewards, token: hotspotsWidgetData.token, accountAddress: hotspotsWidgetData.accountAddress)
          completion(nil, parsedHotspotsWidgetData)
        }
      }
    }
  }
}

/**
 * Fetch hotspot rewards data using helium hotspot rewards endpoint.
 */
func fetchHotspotRewards(hotspotsWidgetData: HotspotsWidgetData, completion: @escaping (Error?, [HotspotsRewardsData]?) -> Void) {
  var urlComps = URLComponents(string: "https://wallet.api.helium.systems/api/hotspots/rewards")!
  var addresses = ""
    
  for (index, hotspot) in hotspotsWidgetData.hotspots.enumerated() {
    addresses += index == 0 ? hotspot.address : ",\(hotspot.address)"
  }
  
  urlComps.queryItems = [URLQueryItem(name: "addresses", value: addresses), URLQueryItem(name: "dayRange", value: "1")]
  
  let url = urlComps.url!
  
  var request = URLRequest(url: url)
  
  // Configure request authentication
  request.setValue(
    hotspotsWidgetData.token,
      forHTTPHeaderField: "Authorization"
  )
  
  // Change the URLRequest to a POST request
  request.httpMethod = "GET"
  
  // Create the HTTP request
  let session = URLSession.shared
  let task = session.dataTask(with: request) { (data, response, error) in

      if let error = error {
          // Handle HTTP request error
        completion(error, nil)
      } else if let data = data {
          // Handle HTTP request response
        do {
            let response = try JSONDecoder().decode(
              Array<HotspotsRewardsData>.self, from: data)
            completion(nil, response)
        }
        catch _ as NSError {
            fatalError("Couldn't fetch data from HotspotsRewardsData")
        }
      } else {
          // Handle unexpected error
        completion(nil,nil)
      }
  }
  
  task.resume()
}

/**
 * Fetch hotspot statuses from helium hotspot status endpoint.
 */
func fetchHotspotStatuses(hotspotsWidgetData: HotspotsWidgetData, completion: @escaping (Error?, HotspotStatusesData?) -> Void) {
  let url = URL(string: "https://wallet.api.helium.systems/proxy/v1/accounts/\(hotspotsWidgetData.accountAddress)/hotspots")
  
  var request = URLRequest(url: url!)
  
  // Configure request authentication
  request.setValue(
    hotspotsWidgetData.token,
      forHTTPHeaderField: "Authorization"
  )
  
  // Change the URLRequest to a POST request
  request.httpMethod = "GET"
  
  // Create the HTTP request
  let session = URLSession.shared
  let task = session.dataTask(with: request) { (data, response, error) in

      if let error = error {
          // Handle HTTP request error
        completion(error, nil)
      } else if let data = data {
          // Handle HTTP request response
        do {
            let response = try JSONDecoder().decode(HotspotStatusesData.self, from: data)
            completion(nil, response)
        }
        catch _ as NSError {
            fatalError("Couldn't fetch data from HotspotStatusesData")
        }
      } else {
          // Handle unexpected error
        completion(nil,nil)
      }
  }
  
  task.resume()
}

