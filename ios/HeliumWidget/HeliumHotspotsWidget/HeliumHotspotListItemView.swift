//
//  HeliumBalanceWidgetEntryView.swift
//  Helium
//
//  Created by Luis F. Perrone on 1/18/22.
//

import SwiftUI

struct HeliumHotspotListItemView : View {
  var hotspotName: String
  var hotspotAddress: String
  var hotspotEarnings: Double
  var hasDivider: Bool
  var online: Bool
  
  init(_ hotspotName: String, _ hotspotAddress: String, _ hotspotEarnings: Double, _ hasDivider: Bool, _ online: Bool) {
      self.hotspotName = hotspotName
      self.hotspotAddress = hotspotAddress
      self.hotspotEarnings = hotspotEarnings
      self.hasDivider = hasDivider
      self.online = online
  }
    
  @ViewBuilder
  var body: some View {
    VStack {
      VStack(alignment: .leading, spacing: 4) {
        HStack {
          Circle()
            .fill(self.online ? Color(red: 41/255, green: 211/255, blue: 68/255) : Color(red: 252/255, green: 201/255, blue: 69/255))
              .frame(width: 8, height:8)
          Text(self.hotspotName).font(.system(size: 12.0))
          Spacer()
        }
        HStack {
          Text(self.hotspotAddress).font(.system(size: 9.0))
          Spacer()
          Text("\(String(format: "%.2f",self.hotspotEarnings)) HNT").font(.system(size: 12.0))
        }

      }.padding(EdgeInsets(top: 0, leading: 10, bottom: 0, trailing: 10))
      if (self.hasDivider) {
        Divider()
      }
    }
  }
}
