const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const srcDir = path.join(__dirname, 'src');

function convertCode(code) {
    // 1. Remove "use strict";
    code = code.replace(/"use strict";\r?\n?/g, '');
    
    // 2. Remove Object.defineProperty(exports, "__esModule", { value: true });
    code = code.replace(/Object\.defineProperty\(exports, "__esModule".*\r?\n?/g, '');

    // 3. Remove __importDefault and __importStar helpers if present
    code = code.replace(/var __importDefault =[\s\S]*?(?=const |let |var |exports|\n\n)/g, '');
    code = code.replace(/var __importStar =[\s\S]*?(?=const |let |var |exports|\n\n)/g, '');

    // 4. Transform `exports.A = exports.B = void 0;`
    code = code.replace(/exports\..*?void 0;\r?\n?/g, '');

    // 5. Replace require
    code = code.replace(/const ([\w_]+)\s*=\s*(?:__importDefault\()?require\("([^"]+)"\)\)?;/g, 'import * as $1 from "$2";');
    
    // 5b. some requires don't use variables: require("reflect-metadata");
    code = code.replace(/require\("([^"]+)"\);/g, 'import "$1";');

    // 6. Transform exports.XXX = ...
    code = code.replace(/^exports\.([\w_]+)\s*=\s*/gm, 'export const $1 = ');

    // 6b. Fix redundant `export const Name = Name;` -> `export { Name };`
    code = code.replace(/export const ([\w_]+)\s*=\s*\1;/g, 'export { $1 };');

    // 7. Simplify variable declarations that export at the same time:
    code = code.replace(/\(0, ([\w_\.]+)\)/g, '$1');

    // 8. Transform exports.default = ...
    code = code.replace(/^export const default = /gm, 'export default ');

    return code.trim() + '\n';
}

function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.js')) {
            const relPath = path.relative(distDir, fullPath);
            // Skip entities as we already did them!
            if (relPath.startsWith('entities')) return;
            
            const destPath = path.join(srcDir, relPath.replace(/\.js$/, '.ts'));
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
            
            let code = fs.readFileSync(fullPath, 'utf8');
            code = convertCode(code);
            fs.writeFileSync(destPath, code);
            console.log(`Converted: ${relPath}`);
        }
    });
}

walk(distDir);
console.log('Decompilation complete!');
