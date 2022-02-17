//
//  HeliumBalanceWidgetEntryView.swift
//  Helium
//
//  Created by Luis F. Perrone on 1/18/22.
//

import WidgetKit
import SwiftUI
import Intents

struct HeliumHotspotsWidgetView : View {
  var entry: HotspotsWidgetProvider.Entry
  @Environment(\.widgetFamily) var family
    
  @ViewBuilder
  var body: some View {
    switch family {
    case .systemMedium:
      
      VStack(alignment: .leading) {
        Spacer()
        
        ForEach(0..<min(entry.isPreview ? 3 : entry.hotspots.count, 3)) { i in
          let rewardObj = entry.rewards.first { reward in
            reward.address == entry.hotspots[i].address
          }
          
          HeliumHotspotListItemView(Utils.removeDashAndCapitalize(text: entry.isPreview ? "Digital Mauve Swan" : entry.hotspots[i].name), entry.isPreview ? "Northeast 5th Ave, Miami, US" : "\(entry.hotspots[i].geocode.longStreet), \(entry.hotspots[i].geocode.shortCity), \(entry.hotspots[i].geocode.shortCountry)", entry.isPreview ? 0.3 : rewardObj?.reward.floatBalance ?? 0.0, i != min(entry.isPreview ? 3 : entry.hotspots.count, 3) - 1, entry.isPreview ? true : entry.hotspots[i].status.online == "online")
        }
        
        Spacer()
      }.background(Color("WidgetBackground"))
    default:
      VStack(alignment: .leading) {
        Spacer()
        
        ForEach(0..<min(entry.isPreview ? 6 : entry.hotspots.count, 6)) { i in
          let rewardObj = entry.rewards.first { reward in
            reward.address == entry.hotspots[i].address
          }
          
          HeliumHotspotListItemView(Utils.removeDashAndCapitalize(text: entry.isPreview ? "Digital Mauve Swan" : entry.hotspots[i].name), entry.isPreview ? "Northeast 5th Ave, Miami, US" : "\(entry.hotspots[i].geocode.longStreet), \(entry.hotspots[i].geocode.shortCity), \(entry.hotspots[i].geocode.shortCountry)", entry.isPreview ? 0.3 : rewardObj?.reward.floatBalance ?? 0.0, true, entry.isPreview ? true : entry.hotspots[i].status.online == "online")
        }

        
        Spacer()

        HStack(alignment: .bottom) {
          Spacer()
          Button(action: {print("")}) {
            Text("See All").font(.system(size: 14.0)).foregroundColor(.gray)
          }
          Spacer()
        }
        
        Spacer()

      }.background(Color("WidgetBackground"))
    }
  }
}
