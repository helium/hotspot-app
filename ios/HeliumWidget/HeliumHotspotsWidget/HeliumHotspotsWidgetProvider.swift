import WidgetKit
import SwiftUI
import Intents

struct HotspotsWidgetData: Decodable {
  var hotspots: [HotspotData]
  var rewards: [RewardsData]
  var token: String
  var accountAddress: String
}

struct HotspotData: Decodable {
  var name: String
  var geocode: GeoCodeData
  var address: String
  var status: StatusData
}

struct RewardsData: Decodable {
  var address: String
  var reward: RewardData
}

struct RewardData: Decodable {
  var floatBalance: Double
}

struct GeoCodeData: Decodable {
  var longStreet: String
  var shortCity: String
  var shortCountry: String
}

struct StatusData: Decodable {
  var online: String
}

struct HotspotsEntry: TimelineEntry {
  let date: Date
  let configuration: ConfigurationIntent
  let hotspots: [HotspotData]
  var rewards: [RewardsData]
  var isPreview: Bool
}

// Helium Hotspots Widget Provider that determines placeholder, snapshot, and timeline for this widget.
struct HotspotsWidgetProvider: IntentTimelineProvider {
  func placeholder(in context: Context) -> HotspotsEntry {
    HotspotsEntry(date: Date(), configuration: ConfigurationIntent(), hotspots: [], rewards: [], isPreview: false)
  }

  func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (HotspotsEntry) -> ()) {
    let entry = HotspotsEntry(date: Date(), configuration: configuration, hotspots: [], rewards: [], isPreview: true)
      completion(entry)
  }

  func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<HotspotsEntry>) -> Void) {
      let userDefaults = UserDefaults.init(suiteName: "group.com.helium.mobile.wallet.widget")
      if userDefaults != nil {
        let entryDate = Date()
        if let savedData = userDefaults!.value(forKey: "myHotspotsWidgetKey") as? String {
            let decoder = JSONDecoder()
            let data = savedData.data(using: .utf8)
            if let parsedData = try? decoder.decode(HotspotsWidgetData.self, from: data!) {
              
              // Fetch hotspots widget data from 2 different endpoints.
              fetchHotspotsWidgetData(hotspotsWidgetData: parsedData) { error, hotspotsWidgetData in
                let nextRefresh = Calendar.current.date(byAdding: .minute, value: 15, to: entryDate)!
                let entry = HotspotsEntry(date: nextRefresh, configuration: configuration, hotspots: hotspotsWidgetData.hotspots, rewards: hotspotsWidgetData.rewards, isPreview: false)
                  let timeline = Timeline(entries: [entry], policy: .atEnd)
                  completion(timeline)
              }
            }
        } else {
            let nextRefresh = Calendar.current.date(byAdding: .minute, value: 5, to: entryDate)!
          let entry = HotspotsEntry(date: nextRefresh, configuration: configuration, hotspots: [], rewards: [], isPreview: false)
            let timeline = Timeline(entries: [entry], policy: .atEnd)
            completion(timeline)
        }
      }
  }
}
