package com.helium.wallet;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactRootView;
import android.view.WindowManager;
import expo.modules.splashscreen.singletons.SplashScreen;
import expo.modules.splashscreen.SplashScreenImageResizeMode;

public class MainActivity extends ReactActivity {
    @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    SplashScreen.show(this, SplashScreenImageResizeMode.COVER, ReactRootView.class, true);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Helium";
  }

  @Override
  protected void onPause() {
    super.onPause();
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
  }

  @Override
  protected void onResume() {
    super.onResume();
    getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
  }
}
