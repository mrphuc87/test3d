#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RCTBridge.h"

@interface V3dViewManager : RCTViewManager
@end

@implementation V3dViewManager

RCT_EXPORT_MODULE(V3dView)

- (UIView *)view
{
  return [[UIView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(color, NSString)

@end
