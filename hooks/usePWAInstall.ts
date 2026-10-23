import { useEffect, useState, useSyncExternalStore } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function subscribeDisplayMode(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(display-mode: standalone)');
  mediaQuery.addEventListener('change', callback);
  window.addEventListener('appinstalled', callback);
  return () => {
    mediaQuery.removeEventListener('change', callback);
    window.removeEventListener('appinstalled', callback);
  };
}

function getStandaloneSnapshot() {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function getIOSSnapshot() {
  if (typeof window === 'undefined') return false;
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
}

function emptySubscribe() {
  return () => {};
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installedState, setInstalledState] = useState(false);

  const isInstalledSync = useSyncExternalStore(
    subscribeDisplayMode,
    getStandaloneSnapshot,
    () => false
  );

  const isIOS = useSyncExternalStore(
    emptySubscribe,
    getIOSSnapshot,
    () => false
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstalledState(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalledState(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: Boolean(deferredPrompt),
    isInstalled: isInstalledSync || installedState,
    isIOS,
    install,
  };
}

