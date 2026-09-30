export function resolveConflict(tableName: string, serverRecord: any, localRecord: any) {
  // Basic strategy: Client Wins (Latest update overwrites server)
  // For production, this could be extended to compare updated_at timestamps
  // or merge specific fields based on the table name.
  
  return {
    ...serverRecord,
    ...localRecord,
    updated_at: new Date().toISOString()
  };
}