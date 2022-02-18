//
//  HeliumBalanceWidgetAPI.swift
//  HeliumWidgetExtension
//
//  Created by Luis F. Perrone on 2/15/22.
//

import Foundation

struct AccountRewardsData: Decodable {
  var total: Double
}

struct AccountBalanceData: Decodable {
  var data: AccountBalanceDataObj
}

struct AccountBalanceDataObj: Decodable {
  var balance: Int
}

struct ParsedBalanceWidgetData {
  var total: Double
  var balance: Int
}

/**
 * Fetch balance widget data using both account rewards & account balance endpoints.
 */
func fetchBalanceWidgetData(balanceWidgetData: BalanceWidgetData, completion: @escaping (Error?, ParsedBalanceWidgetData) -> Void) {
  fetchAccountRewards(balanceWidgetData: balanceWidgetData) { accountRewardsError, accountRewardsData in
    if (accountRewardsError == nil) {
      fetchAccountBalance(balanceWidgetData: balanceWidgetData) { accountBalanceError, accountBalanceData in
        if (accountBalanceError == nil) {
          let parsedBalanceWidgetData = ParsedBalanceWidgetData(total: accountRewardsData?.total ?? 0, balance: accountBalanceData?.data.balance ?? 0)
          completion(nil, parsedBalanceWidgetData)
        }
      }
    }
  }
}

/**
 * Fetch account rewards data using account rewards endpoint.
 */
func fetchAccountRewards(balanceWidgetData: BalanceWidgetData, completion: @escaping (Error?, AccountRewardsData?) -> Void) {
  let urlComps = URLComponents(string: "https://wallet.api.helium.systems/api/accounts/rewards/sum")!
  let url = urlComps.url!
  
  var request = URLRequest(url: url)
  
  // Configure request authentication
  request.setValue(
    balanceWidgetData.token,
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
            let response = try JSONDecoder().decode(AccountRewardsData.self, from: data)
            completion(nil, response)
        }
        catch _ as NSError {
            fatalError("Couldn't fetch data from AccountRewardsData")
        }
      } else {
          // Handle unexpected error
        completion(nil,nil)
      }
  }
  
  task.resume()
}

/**
 * Fetch account balance data using account balance endpoint.
 */
func fetchAccountBalance(balanceWidgetData: BalanceWidgetData, completion: @escaping (Error?, AccountBalanceData?) -> Void) {
  let url = URL(string: "https://wallet.api.helium.systems/proxy/v1/accounts/\(balanceWidgetData.accountAddress)")
  
  var request = URLRequest(url: url!)
  
  // Configure request authentication
  request.setValue(
    balanceWidgetData.token,
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
            let response = try JSONDecoder().decode(AccountBalanceData.self, from: data)
            completion(nil, response)
        }
        catch _ as NSError {
            fatalError("Couldn't fetch data from AccountBalanceData")
        }
      } else {
          // Handle unexpected error
        completion(nil,nil)
      }
  }
  
  task.resume()
}
