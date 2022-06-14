//
//  RNRestart.m
//  MobileRN
//
//  Created by Edwin Nel on 2022/06/12.
//

#import "RNRestart.h"

@implementation RNRestart

RCT_EXPORT_MODULE(RNRestart)

- (void)loadBundle
{
    RCTTriggerReloadCommandListeners(@"react-native-restart: Restart");
}

RCT_EXPORT_METHOD(restart) {
    if ([NSThread isMainThread]) {
        [self loadBundle];
    } else {
        dispatch_sync(dispatch_get_main_queue(), ^{
            [self loadBundle];
        });
    }
    return;
}

@end
