import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {connectionConfig,installSkill} from '../bin/tradeflow-mcp.mjs';

test('OAuth config includes no token, password, client ID or redirect',()=> {
  assert.deepEqual(connectionConfig('https://company.example.test/api/mcp'),{mcpServers:{tradeflow:{type:'http',url:'https://company.example.test/api/mcp'}}});
  for(const value of ['http://remote.example/api/mcp','https://user:pass@company.example/api/mcp','https://company.example/api/mcp?token=x','https://company.example/api/mcp#secret','https://company.example/other'])assert.throws(()=>connectionConfig(value));
});
test('skill installation/update is managed, reversible and contract synchronized',async()=> {
  const temp=await fs.mkdtemp(path.join(os.tmpdir(),'tradeflow-skill-test-'));
  try {const first=await installSkill(temp);assert.equal(first.updated,false);assert.match(await fs.readFile(path.join(first.path,'SKILL.md'),'utf8'),/operationId/);
    const second=await installSkill(temp);assert.equal(second.updated,true);assert.equal(first.contractHash,second.contractHash);assert.ok((await fs.readdir(temp)).some(x=>x.startsWith('tradeflow-mcp.backup-')));
  }finally{await fs.rm(temp,{recursive:true,force:true});}
});
test('does not overwrite an unowned Skill',async()=> {
  const temp=await fs.mkdtemp(path.join(os.tmpdir(),'tradeflow-skill-test-'));try{await fs.mkdir(path.join(temp,'tradeflow-mcp'));await assert.rejects(installSkill(temp),/unowned/);}finally{await fs.rm(temp,{recursive:true,force:true});}
});
