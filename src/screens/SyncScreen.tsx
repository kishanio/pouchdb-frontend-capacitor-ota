import { SyncStatusCard } from "@/components/sync/sync-status";

function SyncScreen() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sync Management</h1>
        <p className="text-muted-foreground">
          Monitor and control data synchronization
        </p>
      </div>
      
      <div className="grid gap-6">
        <SyncStatusCard />
      </div>
    </div>
  );
}

export default SyncScreen;
