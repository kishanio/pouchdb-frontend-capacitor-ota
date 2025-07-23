import PouchDB from "pouchdb";

export interface SyncStatus {
  isActive: boolean;
  isPaused: boolean;
  error: unknown | null;
  lastChange: unknown | null;
  info: unknown | null;
  dbName?: string;
  remoteUrl?: string;
  lastSyncTime?: Date;
}

type SyncEventType = 'status-change' | 'error' | 'change' | 'active' | 'paused' | 'complete';
type SyncEventCallback = (data?: unknown) => void;

class SyncManager {
  private static instance: SyncManager;
  private syncInstance: PouchDB.Replication.Sync<object> | null = null;
  private listeners: Map<SyncEventType, Set<SyncEventCallback>> = new Map();
  private status: SyncStatus = {
    isActive: false,
    isPaused: false,
    error: null,
    lastChange: null,
    info: null,
    dbName: undefined,
    remoteUrl: undefined,
    lastSyncTime: undefined
  };

  private constructor() {
    // Initialize listener maps
    ['status-change', 'error', 'change', 'active', 'paused', 'complete'].forEach(event => {
      this.listeners.set(event as SyncEventType, new Set());
    });
  }

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  startSync(localDB: PouchDB.Database, remoteURL: string, dbName?: string): boolean {
    if (this.syncInstance) {
      console.log("Sync already running");
      return false;
    }

    console.log("Starting PouchDB sync...");
    const remoteDB = new PouchDB(remoteURL);

    // Update status with connection info
    this.status.remoteUrl = remoteURL;
    this.status.dbName = dbName || localDB.name;
    this.emit('status-change', this.status);

    this.syncInstance = localDB
      .sync(remoteDB, {
        live: true,
        retry: true,
      })
      .on("error", (err: unknown) => {
        console.error("Sync error:", err);
        this.status.error = err;
        this.status.isActive = false;
        this.emit('error', err);
        this.emit('status-change', this.status);
        // Clear sync reference on error so it can be retried
        this.syncInstance = null;
      })
      .on("change", (change: unknown) => {
        console.log("Sync change:", change);
        this.status.lastChange = change;
        this.status.lastSyncTime = new Date();
        this.emit('change', change);
        this.emit('status-change', this.status);
      })
      .on("active", () => {
        console.log("Sync active");
        this.status.isActive = true;
        this.status.isPaused = false;
        this.status.error = null;
        this.emit('active');
        this.emit('status-change', this.status);
      })
      .on("paused", () => {
        console.log("Sync paused");
        this.status.isPaused = true;
        this.status.isActive = false;
        this.emit('paused');
        this.emit('status-change', this.status);
      })
      .on("complete", (info: unknown) => {
        console.log("Sync complete:", info);
        this.status.info = info;
        this.status.isActive = false;
        this.status.isPaused = false;
        this.emit('complete', info);
        this.emit('status-change', this.status);
        // Clear sync reference on completion
        this.syncInstance = null;
      });

    return true;
  }

  stopSync(): void {
    if (this.syncInstance) {
      console.log("Stopping PouchDB sync...");
      this.syncInstance.cancel();
      this.syncInstance = null;
      this.status.isActive = false;
      this.status.isPaused = false;
      this.emit('status-change', this.status);
    }
  }

  getStatus(): SyncStatus {
    return { ...this.status };
  }

  isRunning(): boolean {
    return this.syncInstance !== null;
  }

  // Event system
  on(event: SyncEventType, callback: SyncEventCallback): () => void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.add(callback);
    }
    
    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  private emit(event: SyncEventType, data?: unknown): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }
}

export const syncManager = SyncManager.getInstance();
