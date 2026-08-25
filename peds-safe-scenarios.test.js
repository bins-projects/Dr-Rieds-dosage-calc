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
const orderBases=new Set();
const distribution={safe:0,'too low':0,'too high':0};
const pedsRound=n=>Math.round((Number(n)+Number.EPSILON)*100)/100;
const pedsVolume=(dose,have,qty)=>pedsRound(pedsRound(dose/have)*qty);

for(let i=0;i<4000;i++){
  const q=E.generate('peds-safe-range','standard'),v=q.vars;
  seen.add(v.drug);orderBases.add(v.orderBasis);distribution[q.answer]++;
  const minimumDaily=pedsRound(v.kg*v.minDay);
  const maximumWeightDaily=pedsRound(v.kg*v.maxDay);
  const maximumDaily=v.maxDaily?pedsRound(Math.min(maximumWeightDaily,v.maxDaily)):maximumWeightDaily;
  const minimum=v.doseKind==='per-dose'?minimumDaily:pedsRound(minimumDaily/v.doses);
  const maximum=v.doseKind==='per-dose'?maximumDaily:pedsRound(maximumDaily/v.doses);
  const normalizedOrder=v.orderBasis==='daily'?pedsRound(v.order/v.doses):pedsRound(v.order);
  const expected=normalizedOrder<minimum?'too low':normalizedOrder>maximum?'too high':'safe';
  assert.equal(q.answer,expected);
  assert.equal(v.orderDose,normalizedOrder);
  assert.equal(v.ml,pedsVolume(normalizedOrder,v.have,v.qty));
  assert.equal(v.minMl,pedsVolume(minimum,v.have,v.qty));
  assert.equal(v.maxMl,pedsVolume(maximum,v.have,v.qty));
  assert.equal(v.min,minimum);
  assert.equal(v.max,maximum);
  assert.match(q.solution,/Safe dose range:/);
  assert.match(q.solution,/Safe volume range:/);
  assert.match(q.solution,/Ordered (?:dose|daily dose):/);
  assert.match(q.solution,/Comparison:/);
  assert.match(q.prompt,/Calculate the volume per dose/);
  if(v.orderBasis==='daily')assert.match(q.prompt,/mg\/day/);
  else assert.match(q.prompt,/mg\/dose/);
  const rebuilt=E.rebuild('peds-safe-range',v,q);
  assert.equal(rebuilt.answer,q.answer);
  assert.equal(rebuilt.vars.ml,v.ml);
  assert.equal(rebuilt.vars.minMl,v.minMl);
  assert.equal(rebuilt.vars.maxMl,v.maxMl);
}

assert.deepEqual(seen,expectedDrugs);
assert.deepEqual(orderBases,new Set(['per-dose','daily']));
for(const count of Object.values(distribution))assert.ok(count>1000);

const boundaryBase={drug:'test medication',context:'a test condition',kg:32,route:'PO',doses:6,minDay:10,maxDay:15,doseKind:'daily',have:160,qty:5,maxDaily:null};
const cases=[
  {label:'per-dose lower boundary',orderBasis:'per-dose',order:53.33,expectedMl:1.65},
  {label:'per-dose upper boundary',orderBasis:'per-dose',order:80,expectedMl:2.5},
  {label:'daily lower boundary',orderBasis:'daily',order:320,expectedMl:1.65},
  {label:'daily upper boundary',orderBasis:'daily',order:480,expectedMl:2.5}
];
for(const test of cases){
  const rebuilt=E.rebuild('peds-safe-range',{...boundaryBase,...test},{});
  assert.equal(rebuilt.answer,'safe',test.label);
  assert.equal(rebuilt.vars.ml,test.expectedMl,test.label);
}
const perDoseTrap=E.rebuild('peds-safe-range',{...boundaryBase,orderBasis:'per-dose',order:480},{});
assert.equal(perDoseTrap.answer,'too high');
assert.equal(perDoseTrap.vars.orderDose,480);
assert.equal(perDoseTrap.vars.orderedDaily,2880);
assert.equal(perDoseTrap.vars.ml,15);
const dailyBoundary=E.rebuild('peds-safe-range',{...boundaryBase,orderBasis:'daily',order:480},{});
assert.equal(dailyBoundary.answer,'safe');
assert.equal(dailyBoundary.vars.orderDose,80);
assert.equal(dailyBoundary.vars.ml,2.5);

console.log('PASS: 4,000 pediatric safe-range questions across 8 medications and both order bases, including exact boundaries.');
