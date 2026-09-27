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

  // Replace useEffect(() => { ...loadData... }, ...)
  // We need to change synchronous api.get* to await api.get*
  
  // For standard sets: setX(api.getY()) -> setX(await api.getY())
  content = content.replace(/set([A-Za-z0-9]+)\(api\.get([A-Za-z0-9]+)\((.*?)\)\)/g, 'set$1(await api.get$2($3))');
  
  // For filter cases: setX(api.getY().filter(...)) -> setX((await api.getY()).filter(...))
  content = content.replace(/set([A-Za-z0-9]+)\(api\.get([A-Za-z0-9]+)\((.*?)\)\.filter\((.*?)\)\)/g, 'set$1((await api.get$2($3)).filter($4))');

  // For forEach: api.getY().forEach(...) -> (await api.getY()).forEach(...)
  content = content.replace(/api\.get([A-Za-z0-9]+)\((.*?)\)\.forEach\((.*?)\)/g, '(await api.get$1($2)).forEach($3)');

  // For const variable assignments: const x = api.getY(); -> const x = await api.getY();
  content = content.replace(/const ([a-zA-Z0-9]+) = api\.get([A-Za-z0-9]+)\((.*?)\);/g, 'const $1 = await api.get$2($3);');

  // Now, wrap useEffect bodies that contain await.
  // Actually, we can just change loadData to be async.
  content = content.replace(/const loadData = \(\) => {/g, 'const loadData = async () => {');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
