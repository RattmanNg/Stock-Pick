// HTML5 Web Notifications API manager with fallback and vibration for mobile devices

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }
  return false;
}

export function sendBrowserNotification(title: string, options?: NotificationOptions): void {
  if (typeof window === 'undefined') return;

  // Trigger mobile haptic vibration if supported
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate([100, 50, 100]);
    } catch {}
  }

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        badge: '/favicon.ico',
        icon: '/favicon.ico',
        ...options,
      });
    } catch {
      // Some mobile webviews restrict Notification constructor
    }
  }
}
