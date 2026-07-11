const fs = require('fs');
let content = fs.readFileSync('src/components/about/AboutValues.astro', 'utf8');
content = content.replace('const copy = ui[currentLocale].about;\n\nimport AboutCard from "./AboutCard.astro";', 'import AboutCard from "./AboutCard.astro";\nconst copy = ui[currentLocale].about;');
fs.writeFileSync('src/components/about/AboutValues.astro', content, 'utf8');
