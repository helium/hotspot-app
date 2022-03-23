//
//  HeliumBalanceWidgetEntryView.swift
//  Helium
//
//  Created by Luis F. Perrone on 1/18/22.
//

import WidgetKit
import SwiftUI
import Intents

struct HeliumBalanceWidgetEntryView : View {
  var entry: Provider.Entry
    
  var body: some View {
      VStack(alignment: .leading) {
        Spacer()
        HStack(spacing: 0) {
          Image("heliumLogo").resizable()
            .frame(width: 32.0, height: 32.0)
            .foregroundColor(Color(red: 71/255, green: 77/255, blue: 255/255))
          Spacer()
          VStack(alignment: .trailing, spacing: 4) {
            Text("Helium (HNT)")
              .bold()
              .font(.system(size: 10.0))
            Text("$\(String(format: "%.2f",entry.hntPrice))")
              .font(.system(size: 12.0))
          }

        }
        Divider()
        Spacer()
        HStack(alignment: .center) {
          Text("\(String(format: "%.2f",entry.hntDailyEarnings)) HNT")
            .bold()
            .font(.system(size: 12.0))
          Spacer()
          Text(dateToShortFormat())
            .font(.system(size: 12.0))
        }
        Spacer()
        Divider()
        Spacer()

        HStack(spacing: 0) {
          Text("\(String(format: "%.2f",(Double(entry.balance)/100000000))) HNT")
            .bold()
            .font(.system(size: 12.0))
          Spacer()
          Text("Wallet_Title", comment: "Wallet title for users wallet.")
            .font(.system(size: 12.0))
        }
        Spacer()
      }.padding(10).background(Color("WidgetBackground"))
  }
  
  func dateToShortFormat() -> String {
    // Getting yesterdays date object
    let yesterday = Date().dayBefore
    let dateFormatter = DateFormatter()
    dateFormatter.timeZone = TimeZone.current
    dateFormatter.dateFormat = "MMM d"
    return dateFormatter.string(from: yesterday)
  }
}

extension Date {
    var dayBefore: Date {
        return Calendar.current.date(byAdding: .day, value: -1, to: self)!
    }
}
