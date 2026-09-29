export function resolveConflict(table: string, serverRecord: any, localUpdate: any) {
  // Advanced conflict resolution could go here.
  // For now, we apply a "last-write-wins" or field-level merge strategy.
  
  // If the table is inventory_transactions, we should NEVER overwrite, we should append.
  // But transactions are immutable creates, so UPDATE doesn't apply to them.
  
  const resolved = { ...serverRecord, ...localUpdate };
  
  // Example: if server was updated more recently than the local state was created, 
  // maybe we keep server changes for certain fields (like 'updated_at' handling).
  resolved.updated_at = new Date().toISOString();
  
  return resolved;
}
