package com.helium.wallet;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

public class DateModule extends ReactContextBaseJavaModule {
    DateModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "DateModule";
    }

    @ReactMethod
    public void formatDate(String dateStr, String pattern,  Promise promise) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        Date date = null;
        try {
            date = sdf.parse(dateStr);
        } catch (ParseException e) {
            promise.resolve("");
        }
        sdf.setTimeZone(TimeZone.getDefault());
        sdf.applyPattern(pattern);
        String formattedDate = sdf.format(date);
        promise.resolve(formattedDate);
    }
}