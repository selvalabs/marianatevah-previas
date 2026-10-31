import {readFile, readdir, stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('site');
const base='/marianatevah-previas/';
const origin='https://selvalabs.github.io';
const integrity=JSON.parse(await readFile(path.join(root,'integrity.json'),'utf8'));
const actual=[];
async function walk(folder){for(const item of await readdir(folder,{withFileTypes:true})){assert.ok(!item.isSymbolicLink(),'Symlinks are not publishable');const file=path.join(folder,item.name);if(item.isDirectory()) await walk(file);else actual.push(path.relative(root,file).split(path.sep).join('/'));}}
await walk(root);
assert.deepEqual(actual.filter(p=>p!=='integrity.json').sort(),Object.keys(integrity.files).sort(),'Artifact inventory changed');
let links=0;
async function verifyURL(value,from){
 const url=new URL(value,origin+base+from);
 if(url.origin!==origin||['data:','blob:','mailto:','tel:'].includes(url.protocol)||value.startsWith('#'))return;
 assert.ok(url.pathname.startsWith(base),'Asset escaped its base: '+value);
 const relative=decodeURIComponent(url.pathname.slice(base.length));
 const target=path.join(root,!relative||relative.endsWith('/')?relative+'index.html':relative);
 assert.ok((await stat(target)).isFile(),'Missing asset: '+value);links++;
}
for(const relative of actual){
 assert.ok(!/(^|\/)(?:\.env[^/]*|\.git|node_modules)(?:\/|$)|\.(?:astro|tsx?|map)$/i.test(relative),'Private source or environment file in artifact: '+relative);
 if(relative==='integrity.json')continue;
 const bytes=await readFile(path.join(root,relative));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),integrity.files[relative],'Checksum mismatch: '+relative);
 if(!/\.(?:html|css|js|mjs|json)$/.test(relative))continue;
 const text=bytes.toString('utf8');
 assert.ok(!/(?:gh[pousr]_[a-zA-Z0-9]{25,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/.test(text),'Potential credential in artifact');
 if(relative.endsWith('.html')){
  for(const match of text.matchAll(/(?:src|href)="([^"]+)"/g))await verifyURL(match[1],relative);
  for(const match of text.matchAll(/srcset="([^"]+)"/g))for(const candidate of match[1].split(','))await verifyURL(candidate.trim().split(/\s+/)[0],relative);
 }
 if(relative.endsWith('.css'))for(const match of text.matchAll(/url\(([^)]+)\)/g))await verifyURL(match[1].trim().replace(/^["']|["']$/g,''),relative);
 if(relative.endsWith('.js'))assert.ok(!/["'`]\/(?:images|fonts|factory-assets|_astro)\//.test(text),'Unprefixed runtime asset: '+relative);
}
for(const slug of ['clara','escura','ceu-mar']){
 const html=await readFile(path.join(root,slug,'index.html'),'utf8');
 const folds=[...html.matchAll(/<section\b[^>]*\bclass="[^"]*\b(?:hero|chapter)\b[^\"]*"/g)].length;
 assert.equal(folds,12,slug+' must have 12 folds');
 assert.ok(html.includes('noindex,nofollow'),'Review status must be preserved');
}
const manifest=JSON.parse(await readFile(path.join(root,'versions-manifest.json'),'utf8'));
assert.equal(manifest.base,base);assert.equal(manifest.versions.length,3);
console.log(JSON.stringify({passed:true,files:actual.length,localReferencesVerified:links,foldsPerVersion:12,base},null,2));
