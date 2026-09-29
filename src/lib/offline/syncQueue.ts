import { db, SyncOperation } from './db';

export const syncQueue = {
  addOperation: async (
    table: string, 
    record_id: string, 
    action: 'CREATE' | 'UPDATE' | 'DELETE', 
    payload: any
  ) => {
    const op: SyncOperation = {
      id: crypto.randomUUID(),
      table,
      record_id,
      action,
      payload,
      created_at: new Date().toISOString(),
      status: 'PENDING',
      retry_count: 0
    };
    
    await db.sync_queue.add(op);
    
    // Attempt sync if online
    if (navigator.onLine) {
      import('./syncEngine').then(m => m.syncEngine.processQueue());
    }
  },

  getPendingOperations: async () => {
    return await db.sync_queue.where('status').equals('PENDING').toArray();
  },

  markAsSynced: async (id: string) => {
    await db.sync_queue.update(id, { status: 'SYNCED' });
  },

  markAsFailed: async (id: string, error: string) => {
    const op = await db.sync_queue.get(id);
    if (op) {
      await db.sync_queue.update(id, { 
        status: op.retry_count >= 3 ? 'FAILED' : 'PENDING',
        retry_count: op.retry_count + 1,
        error_message: error
      });
    }
  },
  
  clearSynced: async () => {
    await db.sync_queue.where('status').equals('SYNCED').delete();
  }
};
