const fs = require('fs');
const path = require('path');

const dir = 'src/pages';
const files = fs.readdirSync(dir).map(f => path.join(dir, f)).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  if (content.includes('useEffect(() => {') && content.includes('await') && !content.includes('loadData();')) {
       content = content.replace(/useEffect\(\(\) => \{/g, 'useEffect(() => { const loadAsync = async () => {');
       content = content.replace(/\}, \[organization\]\);/g, '}; loadAsync(); }, [organization]);');
       content = content.replace(/\}, \[organization, id\]\);/g, '}; loadAsync(); }, [organization, id]);');
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed useEffect in', file);
  }
});
