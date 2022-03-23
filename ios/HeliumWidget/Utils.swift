//
//  utils.swift
//  Helium
//
//  Created by Luis F. Perrone on 1/23/22.
//

import Foundation
class Utils {
  
  // Function used to remove dash from helium hotspots names and capitalize each word.
  static func removeDashAndCapitalize(text: String) -> String {
      let array = text.components(separatedBy: "-")
      var newText = ""
      for (index, word) in array.enumerated() {
        newText += index < array.count - 1 ? word.capitalized + " " : word.capitalized
      }
      return newText
  }
}
