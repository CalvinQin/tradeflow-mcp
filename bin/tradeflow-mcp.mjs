#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function connectionConfig(endpoint) {
  const url=new URL(endpoint);
  if(url.username||url.password||url.search||url.hash||!url.pathname.endsWith('/api/mcp'))throw new Error('Use the company MCP endpoint without credentials, query or fragment.');
  if(url.protocol!=='https:'&&!(url.protocol==='http:'&&['127.0.0.1','localhost','[::1]'].includes(url.hostname)))throw new Error('Use HTTPS, or a local development loopback endpoint.');
  return {mcpServers:{tradeflow:{type:'http',url:url.href}}};
}
export async function installSkill(destination) {
  if(!destination)throw new Error('Specify the target skills directory with --dir.');
  const directory=path.resolve(destination),target=path.join(directory,'tradeflow-mcp');
  const source=path.join(packageRoot,'skill','tradeflow-mcp');
  const incoming=JSON.parse(await fs.readFile(path.join(packageRoot,'contract.json'),'utf8'));
  let previous;
  try { previous=JSON.parse(await fs.readFile(path.join(target,'contract.json'),'utf8')); }catch(error){if(error.code!=='ENOENT')throw error;}
  if(previous && previous.package!=='@calvinqin/tradeflow-mcp')throw new Error('Target is not a managed TradeFlow Skill. Select a different skills directory.');
  if(!previous) {
    try {await fs.access(target);throw new Error('Existing unowned Skill will not be overwritten.');}catch(error){if(error.code!=='ENOENT')throw error;}
  }
  if(previous)await fs.cp(target,`${target}.backup-${Date.now()}`,{recursive:true,errorOnExist:true,force:false});
  await fs.mkdir(target,{recursive:true});
  await fs.cp(source,target,{recursive:true});
  await fs.copyFile(path.join(packageRoot,'contract.json'),path.join(target,'contract.json'));
  return {path:target,version:incoming.version,contractHash:incoming.contractHash,updated:Boolean(previous)};
}
async function main() {
  const [command,...args]=process.argv.slice(2);
  if(command==='config') {const endpoint=args[0];if(!endpoint)throw new Error('Usage: tradeflow-mcp config https://YOUR-COMPANY/api/mcp');console.log(JSON.stringify(connectionConfig(endpoint),null,2));}
  else if(command==='install-skill'||command==='update-skill') {const index=args.indexOf('--dir');console.log(JSON.stringify(await installSkill(index>=0?args[index+1]:undefined),null,2));}
  else if(command==='contract')console.log(await fs.readFile(path.join(packageRoot,'contract.json'),'utf8'));
  else console.log('TradeFlow MCP: config <company endpoint> | install-skill --dir <skills directory> | update-skill --dir <skills directory> | contract\nSelect OAuth in the receiving MCP client and click Authenticate. This package never stores tokens or passwords.');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error.message);process.exitCode=1;});
