//
//  RCTDateModule.m
//  Helium
//
//  Created by Matt Reetz on 3/24/21.
//

#import "RCTDateModule.h"

@implementation RCTDateModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(formatDate:(NSString *)dateStr
                  pattern:(NSString *)pattern
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSDateFormatter * df = [NSDateFormatter new];
  [df setDateFormat:@"yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"];
  [df setTimeZone:[NSTimeZone timeZoneWithAbbreviation:@"UTC"]];

  NSDate * date = [df dateFromString: dateStr];
  [df setLocalizedDateFormatFromTemplate: pattern];
  [df setTimeZone:[NSTimeZone localTimeZone]];

  NSString * formattedDate = [df stringFromDate: date];

  if(formattedDate != nil){
    resolve(formattedDate);
  } else {
    // Don't reject, just return empty
    resolve(@"");
  }
}

@end
