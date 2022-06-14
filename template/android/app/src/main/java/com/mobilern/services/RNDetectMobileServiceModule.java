package com.mobilern.services;

import android.content.Context;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.common.GoogleApiAvailability;
import com.huawei.hms.api.HuaweiApiAvailability;

public class RNDetectMobileServiceModule extends ReactContextBaseJavaModule {

    public RNDetectMobileServiceModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private String getAvailableMobileService() {
        boolean gms = isGmsAvailable();
        boolean hms = isHmsAvailable();
        String result = "";
        if (gms) {
            result = "gms";
        } else if (hms) {
            result = "hms";
        } else {
            result = "none";
        }
        return result;
    }

    private boolean isHmsAvailable() {
        boolean isAvailable = false;
        Context context = getReactApplicationContext();
        if (null != context) {
            int result = HuaweiApiAvailability.getInstance().isHuaweiMobileServicesAvailable(context);
            isAvailable = (com.huawei.hms.api.ConnectionResult.SUCCESS == result);
        }
        Log.i("React", "isHmsAvailable: " + isAvailable);
        return isAvailable;
    }

    private boolean isGmsAvailable() {
        boolean isAvailable = false;
        Context context = getReactApplicationContext();
        if (null != context) {
            int result = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context);
            isAvailable = (com.google.android.gms.common.ConnectionResult.SUCCESS == result);
        }
        Log.i("React", "isGmsAvailable: " + isAvailable);
        return isAvailable;
    }

    @ReactMethod
    public void toast() {
        Toast.makeText(getReactApplicationContext(),"RNDetectMobileServiceModule has been called",Toast.LENGTH_LONG).show();
    }

    @ReactMethod
    public void getMobileService(final Promise promise) {
        String service = getAvailableMobileService();
        if (null == service) {
            promise.reject("-1", "Error with mobile service");
            return;
        }
        WritableMap map = Arguments.createMap();
        map.putString("mobileService", service);

        promise.resolve(map);
    }

    @Override
    public String getName() {
        return "RNDetectMobileService";
    }
}