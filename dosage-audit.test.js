const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');

global.window={};
for(const file of ['dosage-engine.js','dosage-engine-clinical-pools.js','dosage-engine-expanded-clinical.js','dosage-engine-rate-expansion.js','dosage-rounding.js','dosage-families.js']){
  vm.runInThisContext(fs.readFileSync(file,'utf8'),{filename:file});
}
const E=window.DosageEngine;
const close=(a,b,t=.051)=>assert.ok(Math.abs(Number(a)-Number(b))<=t,`${a} != ${b}`);
const finalRound=n=>Math.round((Math.trunc((Number(n)+Number.EPSILON)*100)/100)*10)/10;

assert.equal(E.finalRound(4.657),4.7);
assert.equal(E.finalRound(5.449),5.4);
assert.equal(E.finalRound(6.95),7);
assert.equal(E.finalRound(8.323),8.3);

let checked=0;
for(const type of E.types){
  for(const difficulty of ['easy','standard','challenge']){
    for(let i=0;i<250;i++){
      const x=E.generate(type.key,difficulty),v=x.vars||{};
      assert.ok(x&&x.prompt&&x.type,`invalid ${type.key}`);
      assert.ok(!/NaN|Infinity|undefined/.test(`${x.prompt} ${x.solution}`),`bad value in ${type.key}`);
      if(Number.isFinite(Number(x.answer))&&!['gtt/min','tablet','tablets','capsule','capsules'].includes(x.unit)){
        assert.equal(Number(x.answer),finalRound(x.answer),`final rounding failed for ${type.key}`);
      }
      switch(x.key){
        case'basic-dose': close(x.answer,finalRound(v.order/v.have*v.qty));break;
        case'weight-dose': close(x.answer,finalRound(v.dose*v.kg*v.qty/v.have));assert.equal(x.unit,'mL');break;
        case'peds-safe-range':{
          const lo=v.minRaw??v.kg*v.minDay/v.doses,hi=v.maxRaw??v.kg*v.maxDay/v.doses;
          const expected=v.order<lo?'too low':v.order>hi?'too high':'safe';
          assert.equal(x.answer,expected);close(v.ml,finalRound(v.order*v.qty/v.have));break;
        }
        case'daily-divided': close(x.answer,finalRound(v.daily*v.kg/v.doses*v.qty/v.have));assert.equal(x.unit,'mL');break;
        case'mlhr-hours':close(x.answer,finalRound(v.volume/v.hours));break;
        case'mlhr-minutes':close(x.answer,finalRound(v.volume/(v.minutes/60)));break;
        case'infusion-time':close(x.answer,finalRound(v.volume/v.rate));break;
        case'gtt-volume-time':assert.equal(x.answer,Math.round(v.volume*v.dropFactor/(v.hours*60)));break;
        case'gtt-from-mlhr':assert.equal(x.answer,Math.round(v.rate*v.dropFactor/60));break;
        case'mlhr-from-gtt':close(x.answer,finalRound(v.dropsPerMinute*60/v.dropFactor));break;
        case'reconstitution':close(x.answer,finalRound(v.order/v.conc));break;
        case'units-hour':close(x.answer,finalRound(v.order/(v.bagUnits/v.bagMl)));break;
        case'mcg-minute':close(x.answer,finalRound(v.order*60/(v.bagMcg/v.bagMl)));break;
        case'mcg-kg-minute':close(x.answer,finalRound(v.dose*v.kg*60/(v.bagMcg/v.bagMl)));break;
        case'mcg-kg-hour':close(x.answer,finalRound(v.dose*v.kg/(v.bagMcg/v.bagMl)));break;
        case'meq-ml':close(x.answer,finalRound(v.order/v.conc));break;
      }
      checked++;
    }
  }
}
console.log(`PASS: ${checked.toLocaleString()} generated questions independently recalculated across ${E.types.length} types.`);
