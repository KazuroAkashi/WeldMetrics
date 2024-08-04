const fs = require('fs');
const path = require('path');

const getAttributes = (filename) => {
    const obj = {};

    let index;
    let name = filename;
    while ((index = name.lastIndexOf('.')) != -1) {
        const attr = name.substring(index + 1);
        obj[attr] = true;
        
        name = name.substring(0, index);
    }

    obj.name = name;
    return obj;
}

const pathmap = new Map();

const walkDir = (startPath, relPath = '') => {
    let list = [];

    const find = fs.readdirSync(startPath);

    for (const found of find) {
        if (found.indexOf('.') == -1) {

            const dive = walkDir(path.join(startPath, found), relPath + '/' + found);

            for (const obj of dive) {
                if (obj.base) {
                    pathmap.set(obj.path + '/', obj.name);
                }

                list.push({ path: found + '/' + obj.path, ...obj });
            }

            continue;
        }

        if (!found.endsWith('.ts')) continue;

        let name = found.substring(0, found.lastIndexOf('.'));
        const attrs = getAttributes(name);

        if (attrs.base) {
            pathmap.set(relPath + '/', attrs.name);
        }

        console.log('Found ' + relPath + '/' + name + '.ts');
        list.push({ path: relPath + '/', fullname: name, ...attrs });
    }

    return list;
}

let imports = '';
let provides = '';

console.log('Looking for service files...');

const files = walkDir(path.join(__dirname, 'services'));

for (const file of files) {
    const base = pathmap.get(file.path);
    if (base && !file.base && !file.use) continue;
    
    if (file.base) continue;

    console.log('Generating for ' + file.path + file.fullname + '.ts');

    imports += 'import { ' + file.name + ' } from \'@/services'+file.path+file.fullname+'\';\n';

    const usename = base ?? file.name;

    if (file.lazy) {
        anylazy = true;
        provides += '\n      ' + usename + ': store.lazyService(\'' + usename + '\', () => new ' + file.name + '()),';
    } else {
        provides += '\n      ' + usename + ': store.service(\'' + usename + '\', () => new ' + file.name + '()),';
    }
}

const content = imports + '\nimport Store from \'./store\';\n\nconst store = new Store();\n\nexport default defineNuxtPlugin(() => {\n  return {\n    provide: {' + provides + '\n    },\n  };\n});';

fs.writeFileSync(path.join(__dirname, 'plugins/locator/index.ts'), content);