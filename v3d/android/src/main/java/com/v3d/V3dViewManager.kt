package com.v3d

import android.graphics.Color
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.V3dViewManagerInterface
import com.facebook.react.viewmanagers.V3dViewManagerDelegate

@ReactModule(name = V3dViewManager.NAME)
class V3dViewManager : SimpleViewManager<V3dView>(),
  V3dViewManagerInterface<V3dView> {
  private val mDelegate: ViewManagerDelegate<V3dView>

  init {
    mDelegate = V3dViewManagerDelegate(this)
  }

  override fun getDelegate(): ViewManagerDelegate<V3dView>? {
    return mDelegate
  }

  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): V3dView {
    return V3dView(context)
  }

  @ReactProp(name = "color")
  override fun setColor(view: V3dView?, color: String?) {
    view?.setBackgroundColor(Color.parseColor(color))
  }

  companion object {
    const val NAME = "V3dView"
  }
}
