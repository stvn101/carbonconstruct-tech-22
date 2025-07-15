// src/services/offline/OfflineSyncManager.ts

interface QueuedOperation {
  id: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  table: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

export class OfflineSyncManager {
  private queue: QueuedOperation[] = [];

  constructor() {
    // Load queue from IndexedDB/localStorage (mocked for now)
    const saved = localStorage.getItem('offlineQueue');
    if (saved) this.queue = JSON.parse(saved);
  }

  queueOperation(op: QueuedOperation): void {
    this.queue.push(op);
    this.persistQueue();
  }

  async processQueue(): Promise<void> {
    if (!navigator.onLine) return;

    const remaining: QueuedOperation[] = [];

    for (const op of this.queue) {
      try {
        // Replace this with your Supabase logic
        await fakeSupabaseWrite(op);
      } catch (err) {
        console.error('Offline sync failed:', err);
        op.retryCount += 1;
        if (op.retryCount < 3) remaining.push(op);
      }
    }

    this.queue = remaining;
    this.persistQueue();
  }

  private persistQueue(): void {
    localStorage.setItem('offlineQueue', JSON.stringify(this.queue));
  }
}

// TEMP: Replace with actual Supabase client code
async function fakeSupabaseWrite(op: QueuedOperation) {
  return new Promise((resolve) => setTimeout(resolve, 300));
}