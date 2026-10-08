import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.name==='.git'||e.name==='node_modules'?[]:e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk(root);
const allowed=/^(?:package\.json|contract\.json|operations\.json|README\.md|LICENSE|bin\/|skill\/|examples\/|scripts\/|test\/|\.github\/)/;
const findings=[];
for(const file of files){const name=path.relative(root,file).split(path.sep).join('/');if(!allowed.test(name))findings.push(`${name}: outside public allowlist`);
  const source=fs.readFileSync(file,'utf8');
  // Patterns identify actual credential values, not field names or symbolic examples.
  for(const pattern of [/\bgh[pousr]_[A-Za-z0-9]{30,}\b/g,/\b(?:tfo|tfr|tfc)_[A-Za-z0-9_-]{43}\b/g,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,/\beyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,/mysql:\/\/[^\s]+/g,/\b(?:sk-[A-Za-z0-9_-]{20,}|AKIA[A-Z0-9]{16})\b/g])if(pattern.test(source))findings.push(`${name}: credential value detected`);
  if(/\.env(?:\.|$)|deploy|receipt|audit|customer-data|production/i.test(name))findings.push(`${name}: private evidence/config name`);
}
const contract=JSON.parse(fs.readFileSync(path.join(root,'contract.json'),'utf8'));
const operations=JSON.parse(fs.readFileSync(path.join(root,'operations.json'),'utf8'));
const skill=JSON.parse(fs.readFileSync(path.join(root,'skill/tradeflow-mcp/contract.json'),'utf8'));
if(!/^[a-f0-9]{64}$/.test(contract.contractHash)||operations.contractHash!==contract.contractHash||skill.contractHash!==contract.contractHash)findings.push('contract/operations/Skill hash mismatch');
if(JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version!==contract.version)findings.push('package/contract version mismatch');
if(findings.length){console.error(findings.join('\n'));process.exitCode=1;}else console.log(JSON.stringify({privacyScan:'PASS',files:files.length,contractHash:contract.contractHash,
  packageFingerprint:crypto.createHash('sha256').update(files.sort().map(f=>path.relative(root,f)+':'+crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')).join('\n')).digest('hex')},null,2));
