import * as fs from 'fs';
import * as path from 'path';

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
}

const files = walkSync('src/pages').concat(walkSync('src/components'));

files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace synchronous api calls inside useEffect
    // This is a naive replacement just for demonstration.
    // Real AST parsing would be needed for a perfect refactor.
    
    // Convert setX(api.getY()) to api.getY().then(setX)
    content = content.replace(/set([A-Za-z]+)\(\s*api\.([A-Za-z]+)\((.*?)\)\s*\)/g, 'api.$2($3).then(set$1)');
    
    // For specific cases like: const exps = api.getExpeditions(organization.id);
    // inside useEffects, this regex is too complex. 
    
    fs.writeFileSync(file, content);
  }
});
console.log('Done');
