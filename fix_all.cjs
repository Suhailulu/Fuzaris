const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('src/pages');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Refactor handlers to be async
  content = content.replace(/const handle([A-Za-z]+) = \(e: React.FormEvent\) => {/g, 'const handle$1 = async (e: React.FormEvent) => {');
  
  // 2. Await writes
  content = content.replace(/api\.create([A-Za-z]+)\(/g, 'await api.create$1(');
  content = content.replace(/api\.update([A-Za-z]+)\(/g, 'await api.update$1(');
  content = content.replace(/api\.add([A-Za-z]+)\(/g, 'await api.add$1(');

  // 3. Await gets inside loadData or useEffect
  // First, find 'loadData = () =>' and make it async
  content = content.replace(/const loadData = \(\) => {/g, 'const loadData = async () => {');

  // Next, if there's a useEffect that directly calls api.get, we must wrap it.
  // We'll look for useEffect(() => { ... api.get ... }, ...)
  // This is too hard with regex. Instead, I'll just change EVERY api.get to await api.get,
  // and then manually run `npm run build` to see which ones are inside non-async functions,
  // and manually fix those few files using multi_replace_file_content!

  content = content.replace(/set([A-Za-z0-9]+)\(api\.get([A-Za-z0-9]+)\((.*?)\)\)/g, 'set$1(await api.get$2($3))');
  content = content.replace(/set([A-Za-z0-9]+)\(api\.get([A-Za-z0-9]+)\((.*?)\)\.filter\((.*?)\)\)/g, 'set$1((await api.get$2($3)).filter($4))');
  content = content.replace(/api\.get([A-Za-z0-9]+)\((.*?)\)\.forEach\((.*?)\)/g, '(await api.get$1($2)).forEach($3)');
  content = content.replace(/const ([a-zA-Z0-9]+) = api\.get([A-Za-z0-9]+)\((.*?)\);/g, 'const $1 = await api.get$2($3);');

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
console.log('done');
