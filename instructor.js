(() => {
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const shuffle=a=>{a=[...a];for(let j=a.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[a[j],a[k]]=[a[k],a[j]]}return a};
  const round=(n,p=1)=>{const f=10**p;return Math.round((Number(n)+Number.EPSILON)*f)/f};
  const randInt=(min,max,step=1)=>min+Math.floor(Math.random()*(Math.floor((max-min)/step)+1))*step;
  const randDec=(min,max,places=1)=>round(min+Math.random()*(max-min),places);
  const q=(key,type,prompt,answer,unit,formula,note,solution,tolerance=.05,vars={})=>({key,type,prompt,answer,unit,formula,note,solution,tolerance,vars});
  const difficulty=()=>document.querySelector('input[name="difficulty"]:checked')?.value||'standard';
  const byDifficulty=(easy,standard,challenge)=>difficulty()==='easy'?easy:difficulty()==='challenge'?challenge:standard;

  function basicDose(){
    const easy=[
      {drug:'acetaminophen',order:325,have:325,qty:1,unit:'tablet',route:'PO'},
      {drug:'acetaminophen',order:650,have:325,qty:1,unit:'tablets',route:'PO'},
      {drug:'amoxicillin',order:250,have:250,qty:5,unit:'mL',route:'PO'},
      {drug:'amoxicillin',order:500,have:250,qty:5,unit:'mL',route:'PO'},
      {drug:'cephalexin',order:250,have:250,qty:5,unit:'mL',route:'PO'},
      {drug:'cephalexin',order:500,have:250,qty:5,unit:'mL',route:'PO'},
      {drug:'ondansetron',order:4,have:4,qty:2,unit:'mL',route:'IV'},
      {drug:'furosemide',order:20,have:20,qty:2,unit:'mL',route:'IV'},
      {drug:'furosemide',order:40,have:20,qty:2,unit:'mL',route:'IV'},
      {drug:'diphenhydramine',order:25,have:50,qty:1,unit:'mL',route:'IV'},
      {drug:'diphenhydramine',order:50,have:50,qty:1,unit:'mL',route:'IV'},
      {drug:'dexamethasone',order:4,have:4,qty:1,unit:'mL',route:'IV'},
      {drug:'ketorolac',order:15,have:15,qty:1,unit:'mL',route:'IV'},
      {drug:'ketorolac',order:30,have:30,qty:1,unit:'mL',route:'IV'},
      {drug:'prednisone',order:10,have:10,qty:1,unit:'tablet',route:'PO'},
      {drug:'prednisone',order:20,have:10,qty:1,unit:'tablets',route:'PO'}
    ];
    const standard=[
      {drug:'acetaminophen',order:325,have:325,qty:1,unit:'tablet',route:'PO'},
      {drug:'acetaminophen',order:650,have:325,qty:1,unit:'tablets',route:'PO'},
      {drug:'amoxicillin',order:250,have:125,qty:5,unit:'mL',route:'PO'},
      {drug:'amoxicillin',order:500,have:125,qty:5,unit:'mL',route:'PO'},
      {drug:'amoxicillin',order:250,have:250,qty:5,unit:'mL',route:'PO'},
      {drug:'amoxicillin',order:500,have:250,qty:5,unit:'mL',route:'PO'},
      {drug:'amoxicillin',order:875,have:250,qty:5,unit:'mL',route:'PO'},
      {drug:'cephalexin',order:250,have:125,qty:5,unit:'mL',route:'PO'},
      {drug:'cephalexin',order:500,have:125,qty:5,unit:'mL',route:'PO'},
      {drug:'cephalexin',order:250,have:250,qty:5,unit:'mL',route:'PO'},
      {drug:'cephalexin',order:500,have:250,qty:5,unit:'mL',route:'PO'},
      {drug:'ondansetron',order:4,have:4,qty:2,unit:'mL',route:'IV'},
      {drug:'furosemide',order:20,have:20,qty:2,unit:'mL',route:'IV'},
      {drug:'furosemide',order:40,have:20,qty:2,unit:'mL',route:'IV'},
      {drug:'furosemide',order:80,have:20,qty:2,unit:'mL',route:'IV'},
      {drug:'diphenhydramine',order:10,have:50,qty:1,unit:'mL',route:'IV'},
      {drug:'diphenhydramine',order:25,have:50,qty:1,unit:'mL',route:'IV'},
      {drug:'diphenhydramine',order:50,have:50,qty:1,unit:'mL',route:'IV'},
      {drug:'dexamethasone',order:4,have:4,qty:1,unit:'mL',route:'IV'},
      {drug:'dexamethasone',order:8,have:4,qty:1,unit:'mL',route:'IV'},
      {drug:'dexamethasone',order:10,have:10,qty:1,unit:'mL',route:'IV'},
      {drug:'ketorolac',order:15,have:15,qty:1,unit:'mL',route:'IV'},
      {drug:'ketorolac',order:15,have:30,qty:1,unit:'mL',route:'IV'},
      {drug:'ketorolac',order:30,have:30,qty:1,unit:'mL',route:'IV'},
      {drug:'prednisone',order:10,have:10,qty:1,unit:'tablet',route:'PO'},
      {drug:'prednisone',order:20,have:10,qty:1,unit:'tablets',route:'PO'},
      {drug:'prednisone',order:30,have:10,qty:1,unit:'tablets',route:'PO'},
      {drug:'prednisone',order:40,have:10,qty:1,unit:'tablets',route:'PO'}
    ];
    const challenge=[
      {drug:'amoxicillin',order:375,have:250,qty:5,unit:'mL',route:'PO'},
      {drug:'amoxicillin',order:625,have:250,qty:5,unit:'mL',route:'PO'},
      {drug:'cephalexin',order:375,have:250,qty:5,unit:'mL',route:'PO'},
      {drug:'cephalexin',order:375,have:125,qty:5,unit:'mL',route:'PO'},
      {drug:'diphenhydramine',order:12.5,have:50,qty:1,unit:'mL',route:'IV'},
      {drug:'diphenhydramine',order:37.5,have:50,qty:1,unit:'mL',route:'IV'},
      {drug:'dexamethasone',order:6,have:4,qty:1,unit:'mL',route:'IV'},
      {drug:'dexamethasone',order:7.5,have:10,qty:1,unit:'mL',route:'IV'},
      {drug:'ketorolac',order:15,have:30,qty:1,unit:'mL',route:'IV'},
      {drug:'prednisone',order:12.5,have:10,qty:1,unit:'tablets',route:'PO'},
      {drug:'prednisone',order:17.5,have:10,qty:1,unit:'tablets',route:'PO'},
      {drug:'prednisone',order:27.5,have:10,qty:1,unit:'tablets',route:'PO'}
    ];
    const c={...pick(byDifficulty(easy,standard,challenge))};
    const a=round(c.order/c.have*c.qty,2);
    return q('basic-dose','Basic medication dose',`A patient has an order for ${c.drug} ${c.order} mg ${c.route}. Available: ${c.have} mg per ${c.qty} ${c.unit}. How many ${c.unit} should the nurse administer?`,a,c.unit,'Desired ÷ Have × Quantity = amount to give','Match the ordered dose to the concentration on hand.',`(${c.order} ÷ ${c.have}) × ${c.qty} = ${a} ${c.unit}`,.06,c)
  }

  function weightDose(){
    const t=pick(byDifficulty(
      [{drug:'gentamicin',dose:1.5,route:'IV q8h',minKg:45,maxKg:85},{drug:'acetaminophen',dose:15,route:'PO per dose',minKg:12,maxKg:35}],
      [{drug:'clindamycin',dose:10,route:'IV per dose',minKg:18,maxKg:45},{drug:'vancomycin',dose:15,route:'IV per dose',minKg:40,maxKg:95},{drug:'gentamicin',dose:1.5,route:'IV q8h',minKg:45,maxKg:90}],
      [{drug:'gentamicin',dose:1.7,route:'IV q8h',minKg:45,maxKg:90},{drug:'vancomycin',dose:17.5,route:'IV per dose',minKg:40,maxKg:95},{drug:'clindamycin',dose:12.5,route:'IV per dose',minKg:18,maxKg:45}]
    ));
    const kg=difficulty()==='easy'?randInt(t.minKg,t.maxKg):randDec(t.minKg,t.maxKg,1),a=round(kg*t.dose,1),c={drug:t.drug,kg,dose:t.dose,route:t.route};
    return q('weight-dose','Weight-based dose',`A ${kg}-kg patient is prescribed ${t.drug} ${t.dose} mg/kg/dose ${t.route}. How many mg should the patient receive per dose?`,a,'mg','mg/kg/dose × kg = mg per dose','Multiply dose per kilogram by weight.',`${t.dose} × ${kg} = ${a} mg/dose`,.06,c)
  }

  function pedsSafe(){
    const freq=pick([{freq:'q6h',doses:4},{freq:'q8h',doses:3},{freq:'q12h',doses:2}]);
    const kg=difficulty()==='easy'?randInt(12,32):randDec(11.5,34.5,1),have=pick([125,250]),qty=5;
    const min=round(kg*25/freq.doses,1),max=round(kg*50/freq.doses,1);
    const status=pick(['low','safe','high']);
    let order;
    if(status==='low') order=Math.max(25,Math.round((min-randDec(Math.max(8,min*.08),Math.max(15,min*.25),1))/5)*5);
    else if(status==='high') order=Math.round((max+randDec(Math.max(10,max*.08),Math.max(20,max*.25),1))/5)*5;
    else order=Math.round(randDec(min,max,1)/5)*5;
    const safety=order<min?'too low':order>max?'too high':'safe',ml=round(order*qty/have,1);
    return q('peds-safe-range','Pediatric safe-dose range',`A child weighs ${kg} kg. The provider orders cephalexin ${order} mg PO ${freq.freq}. Recommended: 25–50 mg/kg/day in equally divided doses. Available: ${have} mg/${qty} mL. Is the ordered dose safe, too low, or too high?`,safety,'','mg/kg/day × kg ÷ doses/day = safe mg/dose range','Find the min/max per-dose range before comparing the order.',`Safe range: ${min}–${max} mg/dose. Order ${order} mg is ${safety}.${safety==='safe'?` Amount: ${ml} mL.`:''}`,.05,{kg,order,...freq,have,qty,min,max,ml})
  }

  function mlhr(){const volume=pick([100,150,250,500,1000]),hours=pick(byDifficulty([2,4,5,8],[1.5,2.25,3.5,4.5,5.5,6.5,7.5,8],[1.8,2.7,3.75,4.6,5.25,6.8,7.25]));const a=round(volume/hours,1);return q('mlhr-hours','mL/hr — hours',`Infuse ${volume} mL over ${hours} hours. What rate should the IV pump be programmed to?`,a,'mL/hr','mL ÷ hours = mL/hr','Divide volume by hours.',`${volume} ÷ ${hours} = ${a} mL/hr`,.05,{volume,hours})}
  function mlhrMin(){const volume=pick([50,100,150,250]),minutes=pick(byDifficulty([30,45,60,90],[35,40,45,50,55,75,90,105,120],[37,43,47,53,67,83,97,107]));const a=round(volume/(minutes/60),1);return q('mlhr-minutes','mL/hr — minutes',`Infuse ${volume} mL over ${minutes} minutes. What rate should the IV pump be programmed to?`,a,'mL/hr','mL ÷ (minutes ÷ 60) = mL/hr','Convert minutes to hours first.',`${volume} ÷ (${minutes} ÷ 60) = ${a} mL/hr`,.05,{volume,minutes})}
  function duration(){const volume=pick([100,250,500,1000]),rate=pick(byDifficulty([50,75,100,125,200],[72,83,92,108,115,123,137,150],[67,79,87,113,117,129,143]));const a=round(volume/rate,2);return q('infusion-time','Infusion duration',`${volume} mL is infusing at ${rate} mL/hr. How many hours will the infusion take?`,a,'hours','mL ÷ mL/hr = hours','Divide volume by rate.',`${volume} ÷ ${rate} = ${a} hr`,.02,{volume,rate})}
  function completion(){const start=`${String(randInt(0,23)).padStart(2,'0')}:${String(pick([0,5,10,15,20,25,30,35,40,45,50,55])).padStart(2,'0')}`,v=pick([100,250,500,1000]),r=pick(byDifficulty([50,100,125,200],[72,83,92,108,115,123,137],[67,79,87,93,113,117,129]));const[hh,mm]=start.split(':').map(Number),mins=Math.round(v/r*60),end=(hh*60+mm+mins)%1440,ans=`${String(Math.floor(end/60)).padStart(2,'0')}:${String(end%60).padStart(2,'0')}`;return q('completion-time','Completion time',`${v} mL starts at ${start} and infuses at ${r} mL/hr. Using 24-hour time, when will it finish?`,ans,'','start time + infusion duration = finish time','Find the duration, then add it to the start time.',`${v} ÷ ${r} hr; finish = ${ans}`,0,{start,v,r})}
  function gtt(){const v=pick([100,250,500,1000]),h=pick(byDifficulty([2,4,5,8],[1.5,2.25,3.5,4.5,5.5,7.5],[1.8,2.7,3.75,4.6,5.25,7.25])),d=pick([10,15,20,60]),a=Math.round(v*d/(h*60));return q('gtt-volume-time','gtt/min — volume + time',`Infuse ${v} mL over ${h} hours. Drop factor: ${d} gtt/mL. Calculate gtt/min.`,a,'gtt/min','(mL × gtt/mL) ÷ minutes = gtt/min','Convert hours to minutes and round to a whole drop.',`(${v} × ${d}) ÷ ${h*60} = ${a} gtt/min`,.05,{volume:v,hours:h,dropFactor:d})}
  function gttFromMlhr(){const r=pick(byDifficulty([50,75,100,125,150],[72,83,92,108,117,123,137],[67,79,89,113,127,143])),d=pick([10,15,20,60]),a=Math.round(r*d/60);return q('gtt-from-mlhr','mL/hr → gtt/min',`An IV runs at ${r} mL/hr using tubing ${d} gtt/mL. What is the gravity rate?`,a,'gtt/min','(mL/hr × gtt/mL) ÷ 60 = gtt/min','Convert hourly rate to drops per minute.',`(${r} × ${d}) ÷ 60 = ${a} gtt/min`,.05,{rate:r,dropFactor:d})}
  function mlhrFromGtt(){const g=pick(byDifficulty([15,20,25,30,40,50],[17,19,23,27,31,37,43,47],[13,17,23,29,31,41,47,53])),d=pick([10,15,20,60]),a=round(g*60/d,1);return q('mlhr-from-gtt','gtt/min → mL/hr',`${g} gtt/min is running through tubing ${d} gtt/mL. What is the mL/hr rate?`,a,'mL/hr','(gtt/min × 60) ÷ gtt/mL = mL/hr','Convert drops/min to drops/hour, then divide by drop factor.',`(${g} × 60) ÷ ${d} = ${a} mL/hr`,.05,{dropsPerMinute:g,dropFactor:d})}

  function reconstitution(){const t=pick(byDifficulty(
    [{drug:'ampicillin',conc:250,orders:[250,500,750]}],
    [{drug:'cefazolin',conc:330,orders:[495,660,825,990]},{drug:'methylprednisolone',conc:62.5,orders:[62.5,75,93.75,125]},{drug:'ampicillin',conc:250,orders:[375,500,625,750]}],
    [{drug:'cefazolin',conc:330,orders:[550,715,775,935]},{drug:'methylprednisolone',conc:62.5,orders:[68.75,81.25,87.5,106.25]}]
  ));const order=pick(t.orders),a=round(order/t.conc,2),c={drug:t.drug,order,conc:t.conc};return q('reconstitution','Reconstitution',`After reconstitution, ${t.drug} is ${t.conc} mg/mL. Order: ${order} mg. How many mL?`,a,'mL','ordered dose ÷ concentration = mL','Use the final concentration.',`${order} ÷ ${t.conc} = ${a} mL`,.03,c)}
  function unitsHr(){const insulin=Math.random()<.3;const c=insulin?{drug:'regular insulin',order:difficulty()==='easy'?randInt(2,10):randDec(2,10,1),bagUnits:100,bagMl:100}:{drug:'heparin',order:difficulty()==='easy'?randInt(800,1800,100):randInt(825,1775,25),bagUnits:25000,bagMl:500};const a=round(c.order*c.bagMl/c.bagUnits,1);return q('units-hour','Units/hr infusion',`${c.drug} is ordered at ${c.order} units/hr. Bag: ${c.bagUnits.toLocaleString()} units in ${c.bagMl} mL. Set the pump to?`,a,'mL/hr','units/hr × mL ÷ total units = mL/hr','Use the concentration in the bag.',`${c.order} × ${c.bagMl} ÷ ${c.bagUnits} = ${a} mL/hr`,.05,c)}
  function mcgMin(){const order=difficulty()==='easy'?randInt(10,80,10):randInt(15,95,5),c={drug:'nitroglycerin',order,bagMcg:50000,bagMl:250};const a=round(c.order*60*c.bagMl/c.bagMcg,1);return q('mcg-minute','mcg/min infusion',`${c.drug} is ordered at ${c.order} mcg/min. Bag: ${c.bagMcg.toLocaleString()} mcg in ${c.bagMl} mL. Set mL/hr.`,a,'mL/hr','mcg/min × 60 × mL ÷ total mcg = mL/hr','Convert minute dose to hourly dose first.',`${c.order} × 60 × ${c.bagMl} ÷ ${c.bagMcg} = ${a} mL/hr`,.05,c)}
  function mcgKgMin(){const t=pick([{drug:'dopamine',doseMin:2,doseMax:10,bagMcg:400000},{drug:'dobutamine',doseMin:2.5,doseMax:10,bagMcg:250000},{drug:'norepinephrine',doseMin:.02,doseMax:.2,bagMcg:8000}]),kg=difficulty()==='easy'?randInt(50,90,5):randDec(48,92,1),dose=t.drug==='norepinephrine'?randDec(t.doseMin,t.doseMax,2):difficulty()==='easy'?randInt(Math.ceil(t.doseMin),Math.floor(t.doseMax)):randDec(t.doseMin,t.doseMax,1),c={drug:t.drug,kg,dose,bagMcg:t.bagMcg,bagMl:250};const a=round(c.dose*c.kg*60*c.bagMl/c.bagMcg,1);return q('mcg-kg-minute','mcg/kg/min infusion',`${c.drug} ${c.dose} mcg/kg/min for a ${c.kg}-kg patient. Bag: ${c.bagMcg.toLocaleString()} mcg in ${c.bagMl} mL. Set mL/hr.`,a,'mL/hr','mcg/kg/min × kg × 60 × mL ÷ mcg = mL/hr','Calculate mcg/min first, then hourly pump rate.',`${c.dose} × ${c.kg} × 60 × ${c.bagMl} ÷ ${c.bagMcg} = ${a} mL/hr`,.05,c)}
  function amountHr(){const t=pick([{drug:'amiodarone',unit:'mg',bagAmt:450,bagMl:250,min:30,max:75,step:5},{drug:'magnesium sulfate',unit:'g',bagAmt:20,bagMl:500,min:1,max:3,step:.25},{drug:'calcium gluconate',unit:'g',bagAmt:10,bagMl:500,min:.5,max:1.5,step:.25}]),steps=Math.round((t.max-t.min)/t.step),order=round(t.min+randInt(0,steps)*t.step,2),c={drug:t.drug,order,unit:t.unit,bagAmt:t.bagAmt,bagMl:t.bagMl};const a=round(c.order*c.bagMl/c.bagAmt,1);return q('amount-hour','mg/hr or g/hr infusion',`${c.drug} is ordered at ${c.order} ${c.unit}/hr. Bag: ${c.bagAmt} ${c.unit} in ${c.bagMl} mL. Set mL/hr.`,a,'mL/hr',`${c.unit}/hr × mL ÷ total ${c.unit} = mL/hr`,'Keep the same mass unit in numerator and denominator.',`${c.order} × ${c.bagMl} ÷ ${c.bagAmt} = ${a} mL/hr`,.05,c)}
  function meqMl(){const t=pick([{drug:'potassium chloride',conc:2,min:10,max:40,step:2.5},{drug:'sodium bicarbonate',conc:1,min:10,max:50,step:2.5},{drug:'potassium acetate',conc:2,min:10,max:40,step:2.5}]),steps=Math.round((t.max-t.min)/t.step),order=round(t.min+randInt(0,steps)*t.step,1),c={drug:t.drug,order,conc:t.conc};const a=round(c.order/c.conc,1);return q('meq-ml','mEq to mL',`${c.drug} order: ${c.order} mEq. Available: ${c.conc} mEq/mL. How many mL?`,a,'mL','mEq ÷ mEq/mL = mL','Divide ordered mEq by concentration.',`${c.order} ÷ ${c.conc} = ${a} mL`,.05,c)}
  function dailyDivided(){const t=pick([{drug:'amoxicillin',dose:40,doses:3,freq:'q8h'},{drug:'cephalexin',dose:50,doses:4,freq:'q6h'},{drug:'clindamycin',dose:30,doses:3,freq:'q8h'},{drug:'cefuroxime',dose:30,doses:2,freq:'q12h'}]),kg=difficulty()==='easy'?randInt(12,32):randDec(11.5,34.5,1),c={...t,kg};const a=round(c.kg*c.dose/c.doses,1);return q('daily-divided','Daily divided dose',`${c.drug} is ordered at ${c.dose} mg/kg/day for a ${c.kg}-kg patient, divided ${c.freq}. How many mg per dose?`,a,'mg/dose','mg/kg/day × kg ÷ doses/day = mg/dose','Calculate the full daily amount before dividing.',`${c.dose} × ${c.kg} ÷ ${c.doses} = ${a} mg/dose`,.05,c)}

  const defs=[
    ['basic-dose','Basic medication dose',basicDose],['weight-dose','Weight-based dose',weightDose],['peds-safe-range','Pediatric safe-dose range',pedsSafe],
    ['mlhr-hours','mL/hr — hours',mlhr],['mlhr-minutes','mL/hr — minutes',mlhrMin],['infusion-time','Infusion duration',duration],['completion-time','Completion time',completion],
    ['gtt-volume-time','gtt/min — volume + time',gtt],['gtt-from-mlhr','mL/hr → gtt/min',gttFromMlhr],['mlhr-from-gtt','gtt/min → mL/hr',mlhrFromGtt],
    ['reconstitution','Reconstitution',reconstitution],['units-hour','Units/hr infusion',unitsHr],['mcg-minute','mcg/min infusion',mcgMin],['mcg-kg-minute','mcg/kg/min infusion',mcgKgMin],['amount-hour','mg/hr or g/hr infusion',amountHr],['meq-ml','mEq to mL',meqMl],['daily-divided','Daily divided dose',dailyDivided]
  ].map(([key,label,random])=>({key,label,random}));
  const byKey=Object.fromEntries(defs.map(d=>[d.key,d]));

  const typeList=document.querySelector('#type-list'),titleInput=document.querySelector('#quiz-title'),review=document.querySelector('#review'),questionList=document.querySelector('#question-list'),status=document.querySelector('#status'),publishStatus=document.querySelector('#publish-status'),approved=document.querySelector('#approved'),publish=document.querySelector('#publish');
  let draft=null;
  typeList.innerHTML=defs.map((t,i)=>`<label><input type="checkbox" name="type" value="${t.key}" ${i===0?'checked':''}> ${t.label}</label>`).join('');
  const selectedTypes=()=>[...document.querySelectorAll('input[name="type"]:checked')].map(x=>x.value);
  const questionCount=()=>+(document.querySelector('input[name="count"]:checked')?.value||20);
  const slug=s=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||`quiz-${Date.now()}`;
  const fingerprint=x=>`${x.key}|${String(x.prompt).toLowerCase().replace(/\s+/g,' ').trim()}`;
  function uniqueFrom(def,used,maxAttempts=400){let x;for(let n=0;n<maxAttempts;n++){x=def.random();if(!used.has(fingerprint(x)))return x}return null}
  function buildQuestion(keys,index,used){const available=defs.filter(t=>keys.includes(t.key)),def=available[index%available.length],x=uniqueFrom(def,used);if(!x)throw new Error(`Could not create another unique ${def.label} question with the current difficulty.`);used.add(fingerprint(x));return x}
  function resetApproval(message='Draft changed. Review approval reset.'){approved.checked=false;publish.disabled=true;publishStatus.textContent=message}
  function buildDraft(){const keys=selectedTypes();if(!keys.length){status.textContent='Choose at least one question type.';return}const count=questionCount(),ordered=shuffle(keys),questions=[],used=new Set();try{for(let n=0;n<count;n++)questions.push(buildQuestion(ordered,n,used))}catch(err){status.textContent=`${err.message} Add another question type, lower the question count, or choose a different difficulty.`;return}const title=titleInput.value.trim()||'Instructor Quiz';draft={version:2,id:slug(title),title,status:'draft',difficulty:difficulty(),createdAt:new Date().toISOString(),questionCount:questions.length,questionTypes:[...new Set(keys)],questions};approved.checked=false;publish.disabled=true;publishStatus.textContent='';status.textContent=`Draft created with ${questions.length} frozen ${difficulty()} questions. Exact duplicate prompts are blocked.`;renderReview()}
  function renderReview(){if(!draft)return;review.hidden=false;document.querySelector('#review-title').textContent=draft.title;questionList.innerHTML=draft.questions.map((x,idx)=>`<article class="question-row"><div class="qnum">${idx+1}</div><div><p>${x.prompt}</p><div class="answer">${x.answer}${x.unit?` ${x.unit}`:''}<span class="badge">${x.type}</span></div><details><summary>Solution</summary><p>${String(x.solution).replace(/\n/g,'<br>')}</p></details></div><button class="secondary replace" data-random="${idx}">Replace</button></article>`).join('')}
  function randomizeOne(index){const def=byKey[draft.questions[index].key],used=new Set(draft.questions.filter((_,i)=>i!==index).map(fingerprint)),replacement=uniqueFrom(def,used);if(!replacement){publishStatus.textContent='No additional unique question is available for that type at this difficulty.';return}draft.questions[index]=replacement;resetApproval('Question replaced with a different prompt. Review approval reset.');renderReview()}
  async function publishDraft(){if(!draft||!approved.checked)return;draft.status='published';draft.publishedAt=new Date().toISOString();publish.disabled=true;publishStatus.textContent='Publishing…';try{const res=await fetch('/instructor-api/instructor-quizzes',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(draft)});if(!res.ok)throw new Error(`HTTP ${res.status}`);const data=await res.json();publishStatus.textContent=`Published. Students can now open “${draft.title}”.`;if(data.id)draft.id=data.id}catch(err){draft.status='approved';const blob=new Blob([JSON.stringify(draft,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${draft.id}.json`;a.click();URL.revokeObjectURL(url);publishStatus.textContent='Secure publish endpoint is not available yet, so the approved quiz JSON was downloaded instead.';publish.disabled=false}}
  document.querySelector('#generate').addEventListener('click',buildDraft);
  document.querySelector('#regenerate').addEventListener('click',buildDraft);
  document.querySelector('#clear').addEventListener('click',()=>{draft=null;review.hidden=true;status.textContent='';publishStatus.textContent=''});
  questionList.addEventListener('click',e=>{const b=e.target.closest('[data-random]');if(b)randomizeOne(+b.dataset.random)});
  approved.addEventListener('change',()=>{publish.disabled=!approved.checked});
  publish.addEventListener('click',publishDraft);
})();