package com.awesomeproject;

import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import android.provider.Settings;
import android.content.Intent;
import android.media.AudioManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class DndModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public DndModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "DndModule";
    }

    // SILENT / DND ON
    @ReactMethod
    public void setSilentMode() {
        NotificationManager nm =
            (NotificationManager) reactContext.getSystemService(Context.NOTIFICATION_SERVICE);
        AudioManager am =
            (AudioManager) reactContext.getSystemService(Context.AUDIO_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (nm != null && nm.isNotificationPolicyAccessGranted()) {
                // Enable DND
                nm.setInterruptionFilter(NotificationManager.INTERRUPTION_FILTER_NONE);
                // Also set ringer to silent for OEMs that keep ringer muted state separate
                if (am != null) am.setRingerMode(AudioManager.RINGER_MODE_SILENT);
            } else {
                // Ask user to grant Do Not Disturb access
                Intent intent = new Intent(Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                reactContext.startActivity(intent);
            }
        } else {
            if (am != null) am.setRingerMode(AudioManager.RINGER_MODE_SILENT);
        }
    }

    // 🔔 NORMAL / DND OFF
    @ReactMethod
    public void setNormalMode() {
        NotificationManager nm =
            (NotificationManager) reactContext.getSystemService(Context.NOTIFICATION_SERVICE);
        AudioManager am =
            (AudioManager) reactContext.getSystemService(Context.AUDIO_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (nm != null && nm.isNotificationPolicyAccessGranted()) {
                // Disable DND
                nm.setInterruptionFilter(NotificationManager.INTERRUPTION_FILTER_ALL);
                // Also restore ringer to normal
                if (am != null) am.setRingerMode(AudioManager.RINGER_MODE_NORMAL);
            } else {
                // Ask user to grant Do Not Disturb access
                Intent intent = new Intent(Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                reactContext.startActivity(intent);
            }
        } else {
            if (am != null) am.setRingerMode(AudioManager.RINGER_MODE_NORMAL);
        }
        
    }
@ReactMethod
public void startForegroundService() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        Intent serviceIntent = new Intent(reactContext, DndForegroundService.class);
        reactContext.startForegroundService(serviceIntent);
    } else {
        Intent serviceIntent = new Intent(reactContext, DndForegroundService.class);
        reactContext.startService(serviceIntent);
    }
}

    
}
