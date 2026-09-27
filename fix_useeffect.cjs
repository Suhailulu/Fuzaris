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

  // We find standard useEffect blocks: useEffect(() => { ... }, [...]);
  // And rewrite them if they contain "await".
  
  // A simple but effective way:
  // If the file has "useEffect(() => {" and contains "await api", we need to wrap the body.
  // Actually, I can just replace `useEffect(() => {` with `useEffect(() => { const loadAsync = async () => {`
  // But where does `loadAsync();` go? Before `}, [dependencies])`.

  // It's much easier to just do it manually for the files that error. Let's list the errors.
  
});
