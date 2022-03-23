import WidgetKit
import SwiftUI
import Intents

  struct HeliumHotspotsWidget: Widget {
      let kind: String = "HeliumHotspotsWidget"
    
      var body: some WidgetConfiguration {
          IntentConfiguration(kind: kind, intent: ConfigurationIntent.self, provider: HotspotsWidgetProvider()) { entry in
            HeliumHotspotsWidgetView(entry: entry)
          }
          .configurationDisplayName(String(localized: "Hotspots_Widget_Title",
                                           comment: "Helium Hotspots widget display name."))
          .description(String(localized: "Hotspots_Widget_Description",
                              comment: "Helium Hotspots widget description.")).supportedFamilies([.systemMedium, .systemLarge])
      }
  }

  struct HeliumHotspotsWidget_Previews: PreviewProvider {
    
      @ViewBuilder
      static var previews: some View {        
        HeliumHotspotsWidgetView(entry: HotspotsEntry(date: Date(), configuration: ConfigurationIntent(), hotspots: [], rewards: [], isPreview: true))
          .previewContext(WidgetPreviewContext(family: .systemLarge))
      }
  }
