const assert=require('node:assert/strict');
const {listRepositories,requestHeaders}=require('./sync-github-projects.cjs');
(async()=>{
 const fixture=Array.from({length:100},(_,i)=>({id:i,name:`repo-${i}`}));
 let calls=0;
 const repos=await listRepositories(async path=>{
  calls++;assert(path.endsWith(`page=${calls}`));
  return{status:200,body:calls===1?fixture:[{id:101,name:'newest-repo'},{id:102,name:'Portfolio'},{id:103,name:'fork',fork:true},{id:104,name:'archived',archived:true},{id:105,name:'private',private:true}]};
 });
 assert.equal(calls,2);assert.equal(repos.length,101);assert(repos.some(r=>r.name==='newest-repo'));
 await assert.rejects(()=>listRepositories(async()=>({status:403,body:null})),/HTTP 403/);
 await assert.rejects(()=>listRepositories(async()=>({status:200,body:{message:'invalid'}})),/Could not list/);
 assert.equal(requestHeaders('https://example.org/demo','fixture').Authorization,undefined);
 assert.equal(requestHeaders('https://api.github.com.evil.example/','fixture').Authorization,undefined);
 assert.equal(requestHeaders('https://api.github.com/users/GXeLla/repos','fixture').Authorization,'Bearer fixture');
 console.log('PASS sync pagination, newest repository, exclusions, API failures and credential scoping');
})().catch(e=>{console.error(e);process.exitCode=1});
