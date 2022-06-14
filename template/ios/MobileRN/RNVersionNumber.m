//
//  RNVersionNumber.m
//  MobileRN
//
//  Created by Edwin Nel on 2022/06/12.
//

#import "RNVersionNumber.h"

@implementation RNVersionNumber

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE(RNVersionNumber)

- (NSDictionary *)constantsToExport
{
    return @{@"appVersion"  : [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"],
             @"buildVersion": [[NSBundle mainBundle] objectForInfoDictionaryKey:(NSString *)kCFBundleVersionKey],
             @"bundleIdentifier"  : [[NSBundle mainBundle] bundleIdentifier]
            };
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

@end

