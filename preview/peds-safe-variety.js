(() => {
  const app=document.querySelector('#app');
  if(!app)return;
  const supplies={
    ceftriaxone:{have:100,unit:'mg',qty:1,note:'after reconstitution'},
    cefazolin:{have:100,unit:'mg',qty:1,note:'after reconstitution'},
    clindamycin:{have:150,unit:'mg',qty:1,note:'vial concentration'},
    ceftazidime:{have:100,unit:'mg',qty:1,note:'after reconstitution'},
    gentamicin:{have:40,unit:'mg',qty:1,note:'vial concentration'},
    tobramycin:{have:40,unit:'mg',qty:1,note:'vial concentration'},
    'penicillin G potassium':{have:500000,unit:'units',qty:1,note:'reconstituted concentration'}
  };
  let active=null,bypass=false;
  const round=(n,p=1)=>{const f=10**p;return Math.round((n+Number.EPSILON)*f)/f};
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const doseRound=(n,unit)=>unit==='units'?Math.round(n/1000)*1000:Math.round(n/5)*5;
  function parseOriginal(text){
    const m=text.match(/weighs ([\d.]+) kg.*orders .*? ([\d.]+) mg .*?(q\d+h).*recommended dose is ([\d.]+)[–-]([\d.]+) mg\/kg\/day.*Available: ([\d.]+) mg\/([\d.]+) mL/i);
    if(!m)return null;
    const kg=+m[1],order=+m[2],freq=m[3],min=+m[4],max=+m[5],have=+m[6],qty=+m[7];
    const doses=freq==='q4h'?6:freq==='q6h'?4:freq==='q8h'?3:freq==='q12h'?2:1;
    const lo=kg*min/doses,hi=kg*max/doses,safety=order<lo?'low':order>hi?'high':'safe';
    return {safety,amount:round(order*qty/have,1)};
  }
  function difficulty(){const t=app.querySelector('.meta span')?.textContent||'';return /Challenge/i.test(t)?'challenge':/Easy/i.test(t)?'easy':'standard'}
  function makeCase(targetSafety){
    const pool=(window.PEDIATRIC_IV_DOSE_REFERENCE||[]).filter(x=>x.mode==='safe-range'&&supplies[x.drug]);
    const d=difficulty(),kg=d==='easy'?pick([12.5,18.5,24.5,30.5]):d==='challenge'?round(11+Math.random()*24,1):round(12+Math.random()*22,1);
    const ref=pick(pool),s=supplies[ref.drug],dose=ref.dose;
    let freq=dose.frequency||pick(dose.frequencyOptions||['q8h']);
    let doses=dose.dosesPerDay||((dose.frequencyOptions||[]).indexOf(freq)>=0?(dose.dosesPerDayOptions||[])[(dose.frequencyOptions||[]).indexOf(freq)]:null)||({q4h:6,q6h:4,q8h:3,q12h:2,q24h:1}[freq]||1);
    let lo,hi,rangeText,unit=dose.unit.startsWith('units')?'units':'mg';
    if(dose.kind==='per-dose-range'){
      lo=kg*dose.min;hi=kg*dose.max;rangeText=`${dose.min}–${dose.max} ${dose.unit}`;
    }else{
      lo=kg*dose.min/doses;hi=kg*dose.max/doses;rangeText=`${dose.min}–${dose.max} ${dose.unit} in equally divided doses`;
    }
    let order;
    if(targetSafety==='safe') order=doseRound(lo+(hi-lo)*(d==='easy'?0.5:(0.25+Math.random()*0.5)),unit);
    if(targetSafety==='low') order=doseRound(lo*(d==='challenge'?0.82:0.9),unit);
    if(targetSafety==='high') order=doseRound(hi*(d==='challenge'?1.18:1.1),unit);
    if(order<=0)order=unit==='units'?1000:5;
    const amount=round(order*s.qty/s.have,1);
    const rangeDose=`${round(lo,1).toLocaleString()}–${round(hi,1).toLocaleString()} ${unit}/dose`;
    const safety=order<lo?'low':order>hi?'high':'safe';
    const prompt=`A child weighs ${kg} kg. The provider orders ${ref.drug} ${order.toLocaleString()} ${unit} IV ${freq} for ${ref.indication}. The recommended dose is ${rangeText}. Available: ${s.have.toLocaleString()} ${s.unit}/${s.qty} mL (${s.note}). Is the ordered dose safe, too low, or too high?`;
    const solution=(dose.kind==='per-dose-range'
      ?`${dose.min} × ${kg} = ${round(lo,1).toLocaleString()} ${unit}/dose minimum\n${dose.max} × ${kg} = ${round(hi,1).toLocaleString()} ${unit}/dose maximum`
      :`${dose.min} × ${kg} ÷ ${doses} = ${round(lo,1).toLocaleString()} ${unit}/dose minimum\n${dose.max} × ${kg} ÷ ${doses} = ${round(hi,1).toLocaleString()} ${unit}/dose maximum`)
      +`\nProvider ordered ${order.toLocaleString()} ${unit}/dose — ${safety==='safe'?'within range':safety==='low'?'too low':'too high'}.`
      +(safety==='safe'?`\n(${order.toLocaleString()} ÷ ${s.have.toLocaleString()}) × ${s.qty} mL = ${amount} mL`:``);
    return {ref,kg,freq,lo,hi,order,unit,amount,safety,prompt,solution,rangeDose};
  }
  function patchQuestion(){
    const meta=app.querySelector('.meta');const problem=app.querySelector('.problem');
    if(!meta||!problem||!meta.textContent.includes('Pediatric safe-dose range')||problem.dataset.variety==='1')return;
    const orig=parseOriginal(problem.textContent);if(!orig)return;
    active={orig,...makeCase(orig.safety)};
    problem.textContent=active.prompt;problem.dataset.variety='1';
  }
  function patchFeedback(){
    if(!active)return;
    const sol=app.querySelector('.solution');if(sol&&!sol.dataset.variety){sol.innerHTML=active.solution.replace(/\n/g,'<br>');sol.dataset.variety='1'}
    const next=app.querySelector('#safety-next .feedback.correct');if(next&&!next.dataset.variety){next.innerHTML=`<b>Safe.</b> The order is within ${active.rangeDose}. Now calculate the amount to administer.`;next.dataset.variety='1'}
  }
  const obs=new MutationObserver(()=>{patchQuestion();patchFeedback()});obs.observe(app,{childList:true,subtree:true});patchQuestion();
  app.addEventListener('click',e=>{
    if(bypass||!active)return;
    const choice=e.target.closest('[data-safe]');
    if(choice){
      e.preventDefault();e.stopImmediatePropagation();
      const correct=choice.dataset.safe===active.safety;
      const send=correct?active.orig.safety:['safe','low','high'].find(x=>x!==active.orig.safety);
      bypass=true;app.querySelector(`[data-safe="${send}"]`)?.click();bypass=false;setTimeout(patchFeedback,0);return;
    }
    const submit=e.target.closest('[data-a="submit-safety-amount"]');
    if(submit){
      e.preventDefault();e.stopImmediatePropagation();
      const raw=app.querySelector('#answer')?.value||'',m=raw.trim().match(/^([\d.]+)\s*(.*)$/),ok=m&&Math.abs(+m[1]-active.amount)<=.06&&m[2].trim().toLowerCase().replace(/\s+/g,'')==='ml';
      app.querySelector('#answer').value=ok?`${active.orig.amount} mL`:'9999 mL';
      bypass=true;submit.click();bypass=false;setTimeout(patchFeedback,0);
    }
  },true);
})();
