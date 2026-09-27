import re
import os

with open('src/lib/api.ts', 'r') as f:
    content = f.read()

# Add import
if "import { supabase }" not in content:
    content = "import { supabase } from './supabase';\n" + content

# Sync function
sync_code = """
  syncSupabase: async (orgId: string) => {
    try {
      const [
        { data: exps },
        { data: cargo },
        { data: inventory },
        { data: assets },
        { data: personnel },
        { data: locations },
        { data: alerts }
      ] = await Promise.all([
        supabase.from('expeditions').select('*').eq('organization_id', orgId),
        supabase.from('cargo').select('*').eq('organization_id', orgId),
        supabase.from('inventory_items').select('*').eq('organization_id', orgId),
        supabase.from('assets').select('*').eq('organization_id', orgId),
        supabase.from('personnel').select('*').eq('organization_id', orgId),
        supabase.from('locations').select('*').eq('organization_id', orgId),
        supabase.from('alerts').select('*').eq('organization_id', orgId)
      ]);
      
      if (exps) setStorage('polar_expeditions', exps);
      if (cargo) setStorage('polar_cargo', cargo);
      if (inventory) setStorage('polar_inventory', inventory);
      if (assets) setStorage('polar_assets', assets);
      if (personnel) setStorage('polar_personnel', personnel);
      if (locations) setStorage('polar_locations', locations);
      if (alerts) setStorage('polar_alerts', alerts);
    } catch (err) {
      console.error('Failed to sync from Supabase', err);
    }
  },
"""

content = content.replace('export const api = {\n', 'export const api = {\n' + sync_code)

# Add background inserts to createExpedition
content = re.sub(
    r"(expeditions\.push\(newExpedition\);\n\s*setStorage\('polar_expeditions', expeditions\);)",
    r"\1\n    supabase.from('expeditions').insert(newExpedition).then(res => { if(res.error) console.error(res.error); });",
    content
)

# Add background inserts to createCargo
content = re.sub(
    r"(cargoList\.push\(newCargo\);\n\s*setStorage\('polar_cargo', cargoList\);)",
    r"\1\n    supabase.from('cargo').insert(newCargo).then(res => { if(res.error) console.error(res.error); });",
    content
)

# Add background inserts to createInventoryItem
content = re.sub(
    r"(items\.push\(newItem\);\n\s*setStorage\('polar_inventory', items\);)",
    r"\1\n    supabase.from('inventory_items').insert(newItem).then(res => { if(res.error) console.error(res.error); });",
    content
)

# Add background inserts to createAsset
content = re.sub(
    r"(assets\.push\(newAsset\);\n\s*setStorage\('polar_assets', assets\);)",
    r"\1\n    supabase.from('assets').insert(newAsset).then(res => { if(res.error) console.error(res.error); });",
    content
)

# Add background inserts to createPersonnel
content = re.sub(
    r"(personnelList\.push\(newPerson\);\n\s*setStorage\('polar_personnel', personnelList\);)",
    r"\1\n    supabase.from('personnel').insert(newPerson).then(res => { if(res.error) console.error(res.error); });",
    content
)

with open('src/lib/api.ts', 'w') as f:
    f.write(content)
