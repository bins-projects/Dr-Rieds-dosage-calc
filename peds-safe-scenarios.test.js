const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');

global.window={};
for(const file of ['dosage-engine.js','dosage-engine-expanded-clinical.js','dosage-engine-rebuild.js','dosage-engine-expanded-rebuild.js']){
  vm.runInThisContext(fs.readFileSync(file,'utf8'),{filename:file});
}

const E=window.DosageEngine;
const expectedDrugs=new Set(['cefazolin','ceftazidime','ceftriaxone','cephalexin','clindamycin','gentamicin','ibuprofen','tobramycin']);
const seen=new Set();
const distribution={safe:0,'too low':0,'too high':0};
const pedsRound=n=>Math.round((Number(n)+Number.EPSILON)*100)/100;
const pedsVolume=(dose,have,qty)=>pedsRound(pedsRound(dose/have)*qty);

for(let i=0;i<4000;i++){
  const q=E.generate('peds-safe-range','standard'),v=q.vars;
  seen.add(v.drug);distribution[q.answer]++;
  const minimumDaily=pedsRound(v.kg*v.minDay);
  const maximumWeightDaily=pedsRound(v.kg*v.maxDay);
  const maximumDaily=v.maxDaily?pedsRound(Math.min(maximumWeightDaily,v.maxDaily)):maximumWeightDaily;
  const minimum=v.doseKind==='per-dose'?minimumDaily:pedsRound(minimumDaily/v.doses);
  const maximum=v.doseKind==='per-dose'?maximumDaily:pedsRound(maximumDaily/v.doses);
  const expected=v.order<minimum?'too low':v.order>maximum?'too high':'safe';
  assert.equal(q.answer,expected);
  assert.equal(v.ml,pedsVolume(v.order,v.have,v.qty));
  assert.equal(v.minMl,pedsVolume(minimum,v.have,v.qty));
  assert.equal(v.maxMl,pedsVolume(maximum,v.have,v.qty));
  assert.equal(v.min,minimum);
  assert.equal(v.max,maximum);
  assert.match(q.solution,/Safe dose range:/);
  assert.match(q.solution,/Safe volume range:/);
  assert.match(q.solution,/Ordered dose:/);
  assert.match(q.prompt,/Calculate the volume/);
  const rebuilt=E.rebuild('peds-safe-range',v,q);
  assert.equal(rebuilt.answer,q.answer);
  assert.equal(rebuilt.vars.ml,v.ml);
  assert.equal(rebuilt.vars.minMl,v.minMl);
  assert.equal(rebuilt.vars.maxMl,v.maxMl);
}

assert.deepEqual(seen,expectedDrugs);
for(const count of Object.values(distribution))assert.ok(count>1000);
console.log('PASS: 4,000 pediatric safe-range questions across 8 medications.');
