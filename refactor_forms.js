import * as fs from 'fs';
import * as path from 'path';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Make form handlers async
  content = content.replace(/const handle([A-Za-z]+) = \(e: React.FormEvent\) => {/g, 'const handle$1 = async (e: React.FormEvent) => {');
  
  // 2. Add await to api.create/update calls
  content = content.replace(/api\.create([A-Za-z]+)\(/g, 'await api.create$1(');
  content = content.replace(/api\.update([A-Za-z]+)\(/g, 'await api.update$1(');
  content = content.replace(/api\.add([A-Za-z]+)\(/g, 'await api.add$1(');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated handlers in ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walk('src/pages');
walk('src/components');
