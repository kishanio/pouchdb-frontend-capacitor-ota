import { useSyncStatus } from "@/hooks/useSyncStatus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SyncStatusCard() {
  const { status, isRunning, stopSync } = useSyncStatus();

  const getStatusBadge = () => {
    if (status.error) {
      return <Badge variant="destructive">Sync Error</Badge>;
    }
    if (status.isActive) {
      return <Badge variant="default">Syncing</Badge>;
    }
    if (status.isPaused) {
      return <Badge variant="secondary">Paused</Badge>;
    }
    if (isRunning) {
      return <Badge variant="outline">Connected</Badge>;
    }
    return <Badge variant="outline">Disconnected</Badge>;
  };

  return (
    <Card className="w-full max-w-xs overflow-clip">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Sync Status</span>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <span>Running:</span>
            <span>{isRunning ? "Yes" : "No"}</span>
          </div>
          <div className="flex justify-between">
            <span>Active:</span>
            <span>{status.isActive ? "Yes" : "No"}</span>
          </div>
          <div className="flex justify-between">
            <span>Paused:</span>
            <span>{status.isPaused ? "Yes" : "No"}</span>
          </div>
        </div>

        {/* Database Info */}
        <div className="mt-4 pt-3 border-t space-y-2">
          <h4 className="font-medium text-sm">Database Info</h4>
          <div className="space-y-2 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">DB Name:</span>
              <span className="font-mono text-xs break-all bg-muted p-1 rounded">
                {status.dbName || "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Remote URL:</span>
              <span className="font-mono text-xs break-all bg-muted p-1 rounded">
                {status.remoteUrl || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Sync:</span>
              <span className="text-xs">
                {status.lastSyncTime 
                  ? status.lastSyncTime.toLocaleString() 
                  : "Never"}
              </span>
            </div>
          </div>
        </div>

        {/* Error Info */}
        {status.error ? (
          <div className="mt-4 pt-3 border-t">
            <div className="text-sm text-red-600">
              <span className="font-medium">Error:</span>
              <pre className="mt-1 text-xs bg-red-50 p-2 rounded max-h-20 overflow-auto">
                {typeof status.error === 'string' ? status.error : JSON.stringify(status.error, null, 2)}
              </pre>
            </div>
          </div>
        ) : null}

        {/* Last Change Info */}
        {status.lastChange ? (
          <div className="mt-4 pt-3 border-t">
            <div className="text-sm text-green-600">
              <span className="font-medium">Last Change:</span>
              <pre className="mt-1 text-xs bg-green-50 p-2 rounded max-h-20 overflow-auto">
                {typeof status.lastChange === 'string' ? status.lastChange : JSON.stringify(status.lastChange, null, 2)}
              </pre>
            </div>
          </div>
        ) : null}
      
        {isRunning && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={stopSync}
            className="w-full mt-4"
          >
            Stop Sync
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function SyncStatusBadge() {
  const { status, isRunning } = useSyncStatus();

  if (status.error) {
    return <Badge variant="destructive">Sync Error</Badge>;
  }
  if (status.isActive) {
    return <Badge variant="default">Syncing</Badge>;
  }
  if (status.isPaused) {
    return <Badge variant="secondary">Paused</Badge>;
  }
  if (isRunning) {
    return <Badge variant="outline">Connected</Badge>;
  }
  return <Badge variant="outline">Disconnected</Badge>;
}
