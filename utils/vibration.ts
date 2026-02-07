import { Capacitor } from '@capacitor/core';
import { Haptics } from '@capacitor/haptics';

/**
 * Triggers a vibration feedback.
 * Works on both Web (using navigator.vibrate) and Native (using Capacitor Haptics).
 * 
 * @param duration Duration in milliseconds. Default is 15ms.
 */
export const triggerVibration = async (duration: number = 15) => {
    try {
        if (Capacitor.isNativePlatform()) {
            await Haptics.vibrate({ duration: duration });
        } else {
            if (navigator.vibrate) {
                navigator.vibrate(duration);
            }
        }
    } catch (err) {
        console.error('Vibration failed:', err);
    }
};
