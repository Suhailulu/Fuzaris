import { supabase } from '../supabase';
import { syncQueue } from './syncQueue';
import { resolveConflict } from './conflictResolver';

class SyncEngine {
  private isProcessing = false;

  async processQueue() {
    if (this.isProcessing || !navigator.onLine) return;
    
    this.isProcessing = true;
    
    try {
      const pendingOps = await syncQueue.getPendingOperations();
      
      for (const op of pendingOps) {
        try {
          if (op.action === 'CREATE') {
            const { error } = await supabase.from(op.table).insert(op.payload);
            if (error && error.code !== '23505') throw error; // ignore duplicate keys for sync
          } 
          else if (op.action === 'UPDATE') {
            // Check for conflict first
            const { data: serverRecord } = await supabase.from(op.table).select('*').eq('id', op.record_id).single();
            
            if (serverRecord) {
              const resolvedPayload = resolveConflict(op.table, serverRecord, op.payload);
              const { error } = await supabase.from(op.table).update(resolvedPayload).eq('id', op.record_id);
              if (error) throw error;
            }
          }
          else if (op.action === 'DELETE') {
            const { error } = await supabase.from(op.table).delete().eq('id', op.record_id);
            if (error) throw error;
          }
          
          await syncQueue.markAsSynced(op.id);
        } catch (error: any) {
          console.error(`Sync failed for operation ${op.id}`, error);
          await syncQueue.markAsFailed(op.id, error.message || 'Unknown error');
        }
      }
    } finally {
      this.isProcessing = false;
      await syncQueue.clearSynced(); // clean up
    }
  }
}

export const syncEngine = new SyncEngine();
