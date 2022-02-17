import WidgetKit
import SwiftUI
import Intents

struct BalanceWidgetData: Decodable {
  var hntPrice: Double
  var token: String
  var accountAddress: String
}

struct BalanceWidgetEntry: TimelineEntry {
  let date: Date
  let configuration: ConfigurationIntent
  var hntPrice: Double
  var hntDailyEarnings: Double
  var balance: Int
}

// Helium Balance Widget Provider that determines placeholder, snapshot, and timeline for this widget.
struct Provider: IntentTimelineProvider {
  func placeholder(in context: Context) -> BalanceWidgetEntry {
    BalanceWidgetEntry(date: Date(), configuration: ConfigurationIntent(), hntPrice: 50.41234, hntDailyEarnings: 54.37, balance: 1500000 )
  }

  func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (BalanceWidgetEntry) -> ()) {
    let entry = BalanceWidgetEntry(date: Date(), configuration: ConfigurationIntent(), hntPrice: 50.41234, hntDailyEarnings: 54.37, balance: 1500000 )
      completion(entry)
  }

  func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<BalanceWidgetEntry>) -> Void) {
      let userDefaults = UserDefaults.init(suiteName: "group.com.helium.mobile.wallet.widget")
      if userDefaults != nil {
        let entryDate = Date()
        if let savedData = userDefaults!.value(forKey: "myBalanceWidgetKey") as? String {
            let decoder = JSONDecoder()
            let data = savedData.data(using: .utf8)
            if let parsedData = try? decoder.decode(BalanceWidgetData.self, from: data!) {
              // Fetch balance data from helium API. This consists of fetching from 2 different endpoints.
              fetchBalanceWidgetData(balanceWidgetData: parsedData) { error, parsedBalanceWidgetData in
                let nextRefresh = Calendar.current.date(byAdding: .minute, value: 15, to: entryDate)!
                let entry = BalanceWidgetEntry(date: nextRefresh, configuration: configuration, hntPrice: parsedData.hntPrice, hntDailyEarnings: parsedBalanceWidgetData.total, balance: parsedBalanceWidgetData.balance)
                let timeline = Timeline(entries: [entry], policy: .atEnd)
                completion(timeline)
              }
              
            }
        } else {
            let nextRefresh = Calendar.current.date(byAdding: .minute, value: 5, to: entryDate)!
          let entry = BalanceWidgetEntry(date: nextRefresh, configuration: configuration, hntPrice: 0, hntDailyEarnings: 0, balance: 0)
            let timeline = Timeline(entries: [entry], policy: .atEnd)
            completion(timeline)
        }
      }
  }
}
