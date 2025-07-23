import { useEffect, useState } from 'react';
import { syncManager, type SyncStatus } from '@/lib/sync-manager';

export function useSyncStatus() {
  const [status, setStatus] = useState<SyncStatus>(syncManager.getStatus());

  useEffect(() => {
    // Subscribe to status changes
    const unsubscribe = syncManager.on('status-change', (newStatus) => {
      setStatus(newStatus as SyncStatus);
    });

    // Get initial status
    setStatus(syncManager.getStatus());

    return unsubscribe;
  }, []);

  return {
    status,
    isRunning: syncManager.isRunning(),
    startSync: syncManager.startSync.bind(syncManager),
    stopSync: syncManager.stopSync.bind(syncManager),
  };
}

export function useSyncEvents() {
  const [lastChange, setLastChange] = useState<unknown>(null);
  const [lastError, setLastError] = useState<unknown>(null);

  useEffect(() => {
    const unsubscribeChange = syncManager.on('change', (change) => {
      setLastChange(change);
    });

    const unsubscribeError = syncManager.on('error', (error) => {
      setLastError(error);
    });

    return () => {
      unsubscribeChange();
      unsubscribeError();
    };
  }, []);

  return {
    lastChange,
    lastError,
  };
}
