import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, XCircle } from "lucide-react";
import { useOfflineState } from "@/hooks/use-offline-state";
import { formatDistanceToNow } from "date-fns";

export const OfflineStatusIndicator: React.FC = () => {
  const { isOffline, lastOnlineTime, getOfflineDuration, checkConnection } =
    useOfflineState();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setVisible(true);
      setDismissed(false);
    } else {
      // When coming back online, briefly show the online message then hide
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOffline]);

  if (!visible || dismissed) return null;

  return (
    <div
      className={`fixed z-50 p-4 rounded-lg shadow-lg
        ${
          isOffline
            ? "bg-warning/10 text-warning"
            : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
        }
        bottom-20 sm:bottom-4 left-4 right-4 sm:left-auto sm:w-80
        max-w-full mx-auto sm:mx-0
        flex items-center justify-between`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center space-x-3">
        {isOffline ? (
          <WifiOff className="h-5 w-5 flex-shrink-0" />
        ) : (
          <Wifi className="h-5 w-5 flex-shrink-0" />
        )}
        <div>
          <p className="font-medium">
            {isOffline ? "You are offline" : "Back online"}
          </p>
          {isOffline && lastOnlineTime && (
            <p className="text-xs mt-1">
              Last online{" "}
              {formatDistanceToNow(lastOnlineTime, { addSuffix: true })}
            </p>
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        {isOffline && (
          <button
            onClick={() => checkConnection()}
            className="text-xs px-2 py-1 bg-warning/20 text-warning rounded hover:bg-warning/30"
          >
            Retry
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
          aria-label="Dismiss notification"
        >
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
