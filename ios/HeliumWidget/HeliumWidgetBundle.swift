//
//  HeliumWidgetBundle.swift
//  HeliumWidgetExtension
//
//  Created by Luis F. Perrone on 1/18/22.
//

import WidgetKit
import SwiftUI
import Intents

@main
struct HeliumWidgetBundle: WidgetBundle {
   var body: some Widget {
       HeliumBalanceWidget()
       HeliumHotspotsWidget()
   }
}
