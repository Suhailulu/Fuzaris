import os
import re

def fix_file(path):
    with open(path, 'r') as f:
        content = f.read()

    original = content
    # For property 'filter' does not exist on type 'Promise<T>'
    # setX((await api.getY(Z)).filter(W)) -> setX((await api.getY(Z)).filter(W))
    # It seems in ExpeditionDetail:
    # setCargoList(await api.getCargoList(organization.id).filter(...))
    # This happens because my previous regex didn't properly wrap the await.
    content = re.sub(r'await (api\.get[A-Za-z]+\(.*?\))\.filter\(', r'(await \1).filter(', content)
    content = re.sub(r'await (api\.get[A-Za-z]+\(.*?\))\.forEach\(', r'(await \1).forEach(', content)

    # Some missed 'await' inside useEffect. We can manually replace the ones in AlertDetail and PersonnelDetail.
    if 'AlertDetail.tsx' in path:
        content = content.replace('const handleUpdateStatus = (', 'const handleUpdateStatus = async (')
        content = content.replace('const handleTaskStatus = (', 'const handleTaskStatus = async (')
    
    if 'PersonnelDetail.tsx' in path:
        content = content.replace('const completeMovement = (', 'const completeMovement = async (')
        
    if 'CargoDetail.tsx' in path:
        content = content.replace('const handleUpdateStatus = (', 'const handleUpdateStatus = async (')

    if 'AssetDetail.tsx' in path:
        content = content.replace('const handleMaintenance = (', 'const handleMaintenance = async (')

    if 'Activity.tsx' in path:
        # wrap the whole loadData in async if not already
        pass

    if 'riskEngine.ts' in path:
        content = content.replace('const inventory = api.getInventoryItems(orgId);', 'const inventory = await api.getInventoryItems(orgId);')

    if content != original:
        with open(path, 'w') as f:
            f.write(content)
        print(f"Fixed {path}")

for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            fix_file(os.path.join(root, f))
