(() => {
const app=document.querySelector('#app'); if(!app)return;
let mode='practice',length=10,qs=[],i=0,score=0,answered=false,selected=[];
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=[...a];for(let j=a.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[a[j],a[k]]=[a[k],a[j]]}return a};
const round=(n,p=1)=>{const f=10**p;return Math.round((n+Number.EPSILON)*f)/f};
function q(type,prompt,answer,unit,formula,note,solution,tolerance=.05,answerMode='numeric'){return{type,prompt,answer,unit,formula,note,solution,tolerance,answerMode}}

const ivContexts=[
  ['0.9% sodium chloride','maintenance IV fluid'],
  ['lactated Ringer’s','replacement IV fluid'],
  ['D5W','IV fluid'],
  ['ceftriaxone','intermittent IV antibiotic'],
  ['vancomycin','intermittent IV antibiotic'],
  ['piperacillin/tazobactam','intermittent IV antibiotic']
];
function contextLead(){const[name,kind]=pick(ivContexts);return `A patient is receiving ${name} as a ${kind}. `}

function basicDose(){
  const c=pick([
    {drug:'amoxicillin',order:500,have:250,qty:5,unit:'mL',route:'PO'},
    {drug:'cephalexin',order:375,have:250,qty:5,unit:'mL',route:'PO'},
    {drug:'acetaminophen',order:650,have:325,qty:1,unit:'tablets',route:'PO'},
    {drug:'prednisone',order:30,have:10,qty:1,unit:'tablets',route:'PO'},
    {drug:'ondansetron',order:4,have:2,qty:1,unit:'mL',route:'IV'},
    {drug:'furosemide',order:40,have:20,qty:2,unit:'mL',route:'IV'}
  ]);
  const a=round(c.order/c.have*c.qty,1);
  return q('Basic medication dose',`A patient has an order for ${c.drug} ${c.order} mg ${c.route}. Available: ${c.have} mg per ${c.qty} ${c.unit}. How many ${c.unit} should the nurse administer?`,a,c.unit,'Desired ÷ Have × Quantity = amount to give','Match the ordered dose to the concentration on hand.',`(${c.order} mg ÷ ${c.have} mg) × ${c.qty} ${c.unit} = ${a} ${c.unit}`,.06)
}
function weightDose(){
  const c=pick([
    {drug:'gentamicin',kg:72,dose:1.5,route:'IV q8h'},
    {drug:'enoxaparin',kg:84,dose:1,route:'subcutaneous q12h'},
    {drug:'cefazolin',kg:68,dose:25,route:'IV per dose'},
    {drug:'acetaminophen',kg:24,dose:15,route:'PO per dose'},
    {drug:'clindamycin',kg:30,dose:10,route:'IV per dose'},
    {drug:'vancomycin',kg:56,dose:15,route:'IV per dose'}
  ]);
  const a=round(c.kg*c.dose,1);
  return q('Weight-based dose',`A ${c.kg}-kg patient is prescribed ${c.drug} ${c.dose} mg/kg/dose ${c.route}. How many mg should the patient receive per dose?`,a,'mg','mg/kg/dose × kg = mg per dose','Multiply the dose ordered per kilogram by the patient’s weight in kilograms.',`${c.dose} mg/kg × ${c.kg} kg = ${a} mg/dose`,.06)
}

const pediatricCases=[
  {drug:'cefprozil',weightLb:17,doseMgKg:15,freq:'q12h',haveMg:125,qtyMl:5},
  {drug:'amoxicillin',weightLb:22,doseMgKg:20,freq:'q12h',haveMg:250,qtyMl:5},
  {drug:'cephalexin',weightLb:33,doseMgKg:12.5,freq:'q6h',haveMg:250,qtyMl:5},
  {drug:'azithromycin',weightLb:44,doseMgKg:10,freq:'q24h',haveMg:200,qtyMl:5},
  {drug:'acetaminophen',weightLb:26,doseMgKg:15,freq:'q6h PRN',haveMg:160,qtyMl:5},
  {drug:'ibuprofen',weightLb:35,doseMgKg:10,freq:'q6h PRN',haveMg:100,qtyMl:5}
];
function pediatricWeightLiquid(){
  const c=pick(pediatricCases),kg=round(c.weightLb/2.2,1),mg=round(kg*c.doseMgKg,1),ml=round(mg*c.qtyMl/c.haveMg,1);
  return q('Pediatric weight-based liquid',`A child weighs ${c.weightLb} lb. The order is ${c.drug} ${c.doseMgKg} mg/kg/dose PO ${c.freq}. Available: ${c.haveMg} mg/${c.qtyMl} mL. How many mL should the nurse administer per dose?`,ml,'mL','lb ÷ 2.2 = kg → mg/kg/dose × kg = mg/dose → Desired ÷ Have × Quantity = mL','Convert pounds to kilograms first, calculate the ordered mg per dose, then convert that dose to mL.',`${c.weightLb} lb ÷ 2.2 = ${kg} kg\n${c.doseMgKg} mg/kg × ${kg} kg = ${mg} mg/dose\n(${mg} mg ÷ ${c.haveMg} mg) × ${c.qtyMl} mL = ${ml} mL`,.06)
}

function mlhr(){const[v,h]=pick([[1000,8],[1000,10],[500,4],[500,5],[250,2],[150,1.5],[100,.5],[250,2.5],[1000,12],[500,8]]);const a=round(v/h,1);return q('mL/hr',`${contextLead()}Infuse ${v.toLocaleString()} mL over ${h} ${h===1?'hour':'hours'}. What rate should the IV pump be programmed to?`,a,'mL/hr','mL ÷ hours = mL/hr','Divide total volume by infusion time.',`${v.toLocaleString()} mL ÷ ${h} hr = ${a} mL/hr`)}
function mlhrMin(){const[v,m,drug]=pick([[100,30,'ceftriaxone'],[250,90,'vancomycin'],[500,150,'ciprofloxacin'],[150,45,'clindamycin'],[50,30,'cefazolin'],[100,45,'metronidazole'],[250,120,'vancomycin'],[75,30,'ampicillin/sulbactam']]);const h=m/60,a=round(v/h,1);return q('Minutes → mL/hr',`A patient has an order for ${drug} in ${v} mL IV to infuse over ${m} minutes. What rate should the IV pump be programmed to?`,a,'mL/hr','mL ÷ (minutes ÷ 60) = mL/hr','Convert minutes to hours first.',`${m} min ÷ 60 = ${round(h,2)} hr\n${v} mL ÷ ${round(h,2)} hr = ${a} mL/hr`)}
function duration(){const[v,r,fluid]=pick([[1000,125,'0.9% sodium chloride'],[500,100,'lactated Ringer’s'],[250,125,'D5W'],[1000,100,'0.9% sodium chloride'],[500,125,'D5 0.45% sodium chloride'],[250,100,'lactated Ringer’s'],[100,200,'ceftriaxone secondary infusion'],[500,80,'0.45% sodium chloride']]);const a=round(v/r,2);return q('Infusion duration',`${fluid}, ${v.toLocaleString()} mL, is infusing at ${r} mL/hr. How many hours will the infusion take?`,a,'hours','mL ÷ mL/hr = hours','Divide volume by hourly rate.',`${v.toLocaleString()} mL ÷ ${r} mL/hr = ${a} hours`,.02)}

function completionTime(){
  const c=pick([
    {start:'08:15',v:1000,r:125,fluid:'0.9% sodium chloride'},
    {start:'21:30',v:500,r:100,fluid:'lactated Ringer’s'},
    {start:'13:45',v:250,r:125,fluid:'ceftriaxone secondary infusion'},
    {start:'23:15',v:500,r:125,fluid:'D5 0.45% sodium chloride'},
    {start:'06:20',v:1000,r:100,fluid:'0.9% sodium chloride'},
    {start:'17:10',v:250,r:100,fluid:'vancomycin secondary infusion'}
  ]);
  const [hh,mm]=c.start.split(':').map(Number),mins=Math.round(c.v/c.r*60),end=(hh*60+mm+mins)%(24*60),eh=String(Math.floor(end/60)).padStart(2,'0'),em=String(end%60).padStart(2,'0'),ans=`${eh}:${em}`;
  return q('Completion time',`${c.fluid}, ${c.v} mL, is started at ${c.start} and infuses at ${c.r} mL/hr. Using 24-hour time, when will the infusion be complete?`,ans,'','start time + infusion duration = finish time','First calculate infusion duration, then add it to the start time. Carry across midnight when necessary.',`${c.v} mL ÷ ${c.r} mL/hr = ${round(c.v/c.r,2)} hr\nStart ${c.start} + ${mins} min = ${ans}`,0,'clock')
}

function gtt(){const[v,h,d,fluid]=pick([[1000,8,15,'0.9% sodium chloride'],[500,4,20,'lactated Ringer’s'],[1000,10,10,'D5W'],[250,2,15,'0.9% sodium chloride'],[500,6,20,'D5 0.45% sodium chloride'],[1000,12,15,'lactated Ringer’s'],[250,4,10,'0.9% sodium chloride'],[120,2,60,'ceftriaxone secondary infusion']]);const m=h*60,r=v*d/m,a=Math.round(r);return q('gtt/min',`A patient is prescribed ${fluid}, ${v.toLocaleString()} mL over ${h} hours. Tubing drop factor is ${d} gtt/mL. Calculate the gravity flow rate.`,a,'gtt/min','(mL × gtt/mL) ÷ minutes = gtt/min','Convert hours to minutes; round final answer to a whole drop.',`${h} hr × 60 = ${m} min\n(${v} × ${d}) ÷ ${m} = ${round(r,2)}\nRound = ${a} gtt/min`)}
function gttFromMlhr(){const[r,d,fluid]=pick([[100,15,'0.9% sodium chloride'],[125,20,'lactated Ringer’s'],[150,10,'D5W'],[75,20,'0.45% sodium chloride'],[80,15,'0.9% sodium chloride'],[120,10,'lactated Ringer’s'],[60,60,'ceftriaxone secondary infusion'],[125,15,'D5 0.45% sodium chloride']]);const x=r*d/60,a=Math.round(x);return q('mL/hr → gtt/min',`${fluid} is infusing at ${r} mL/hr with tubing ${d} gtt/mL. What gravity flow rate should be set?`,a,'gtt/min','(mL/hr × gtt/mL) ÷ 60 = gtt/min','Convert the hourly rate to drops per minute.',`(${r} × ${d}) ÷ 60 = ${round(x,2)}\nRound = ${a} gtt/min`)}
function mlhrFromGtt(){const[g,d,fluid]=pick([[25,15,'0.9% sodium chloride'],[42,20,'lactated Ringer’s'],[20,10,'D5W'],[60,60,'ceftriaxone secondary infusion'],[30,15,'0.45% sodium chloride'],[40,20,'lactated Ringer’s'],[15,10,'0.9% sodium chloride'],[50,20,'D5 0.45% sodium chloride']]);const a=round(g*60/d,1);return q('gtt/min → mL/hr',`${fluid} is running at ${g} gtt/min using tubing ${d} gtt/mL. What is the equivalent infusion rate?`,a,'mL/hr','(gtt/min × 60) ÷ gtt/mL = mL/hr','Convert drops per minute to drops per hour, then divide by the drop factor.',`(${g} × 60) ÷ ${d} = ${a} mL/hr`)}

function reconstitution(){
  const c=pick([
    {drug:'cefazolin',order:750,conc:330},
    {drug:'ceftriaxone',order:1000,conc:350},
    {drug:'ampicillin',order:500,conc:250},
    {drug:'meropenem',order:750,conc:50},
    {drug:'penicillin G',order:1200000,conc:500000,unit:'units'},
    {drug:'methylprednisolone',order:80,conc:62.5}
  ]);
  const amountUnit=c.unit||'mg',a=round(c.order/c.conc,2);
  return q('Reconstitution',`After reconstitution, ${c.drug} is labeled ${c.conc.toLocaleString()} ${amountUnit}/mL. The order is ${c.order.toLocaleString()} ${amountUnit}. How many mL should the nurse draw up?`,a,'mL','ordered dose ÷ resulting concentration = mL to draw','Use the final concentration printed on the reconstituted medication label.',`${c.order.toLocaleString()} ${amountUnit} ÷ ${c.conc.toLocaleString()} ${amountUnit}/mL = ${a} mL`,.03)
}

function unitsHr(){
  const c=pick([
    {drug:'heparin',order:1200,bagUnits:25000,bagMl:500},
    {drug:'heparin',order:900,bagUnits:25000,bagMl:250},
    {drug:'regular insulin',order:4,bagUnits:100,bagMl:100},
    {drug:'regular insulin',order:6,bagUnits:100,bagMl:100},
    {drug:'heparin',order:1500,bagUnits:20000,bagMl:500}
  ]);
  const conc=c.bagUnits/c.bagMl,a=round(c.order/conc,1);
  return q('Units/hr infusion',`A patient is receiving ${c.drug}. The order is ${c.order.toLocaleString()} units/hr. The IV contains ${c.bagUnits.toLocaleString()} units in ${c.bagMl} mL. What rate should the pump be set to?`,a,'mL/hr','ordered units/hr ÷ units/mL = mL/hr','Find the concentration in units per mL, then divide the hourly order by that concentration.',`${c.bagUnits.toLocaleString()} units ÷ ${c.bagMl} mL = ${round(conc,2)} units/mL\n${c.order.toLocaleString()} units/hr ÷ ${round(conc,2)} units/mL = ${a} mL/hr`,.06)
}

function mcgMin(){
  const c=pick([
    {drug:'nitroglycerin',order:20,bagMcg:50000,bagMl:250},
    {drug:'nitroglycerin',order:40,bagMcg:50000,bagMl:250},
    {drug:'dopamine',order:400,bagMcg:400000,bagMl:250},
    {drug:'dobutamine',order:250,bagMcg:250000,bagMl:250}
  ]);
  const conc=c.bagMcg/c.bagMl,a=round(c.order*60/conc,1);
  return q('mcg/min infusion',`A patient has an order for ${c.drug} ${c.order} mcg/min. The IV contains ${c.bagMcg.toLocaleString()} mcg in ${c.bagMl} mL. What pump rate is required?`,a,'mL/hr','(mcg/min × 60) ÷ mcg/mL = mL/hr','Convert the ordered minute dose to an hourly dose, then divide by the concentration.',`${c.bagMcg.toLocaleString()} mcg ÷ ${c.bagMl} mL = ${round(conc,2)} mcg/mL\n${c.order} mcg/min × 60 = ${c.order*60} mcg/hr\n${c.order*60} ÷ ${round(conc,2)} = ${a} mL/hr`,.06)
}

function mcgKgMin(){
  const c=pick([
    {drug:'dopamine',kg:70,order:5,bagMcg:400000,bagMl:250},
    {drug:'norepinephrine',kg:80,order:.08,bagMcg:8000,bagMl:250},
    {drug:'dobutamine',kg:60,order:7.5,bagMcg:250000,bagMl:250},
    {drug:'epinephrine',kg:75,order:.05,bagMcg:4000,bagMl:250}
  ]);
  const conc=c.bagMcg/c.bagMl,hourly=c.order*c.kg*60,a=round(hourly/conc,1);
  return q('mcg/kg/min infusion',`A ${c.kg}-kg patient is prescribed ${c.drug} ${c.order} mcg/kg/min. The IV contains ${c.bagMcg.toLocaleString()} mcg in ${c.bagMl} mL. What rate should the pump be set to?`,a,'mL/hr','(mcg/kg/min × kg × 60) ÷ mcg/mL = mL/hr','Calculate the weight-based dose per minute, convert to an hourly dose, then divide by the concentration.',`${c.order} × ${c.kg} × 60 = ${round(hourly,2)} mcg/hr\n${c.bagMcg.toLocaleString()} mcg ÷ ${c.bagMl} mL = ${round(conc,2)} mcg/mL\n${round(hourly,2)} ÷ ${round(conc,2)} = ${a} mL/hr`,.06)
}

function amountHr(){
  const c=pick([
    {drug:'magnesium sulfate',order:2,orderUnit:'g',bagAmount:20,bagUnit:'g',bagMl:500},
    {drug:'lidocaine',order:2,orderUnit:'mg',bagAmount:1000,bagUnit:'mg',bagMl:250},
    {drug:'amiodarone',order:60,orderUnit:'mg',bagAmount:450,bagUnit:'mg',bagMl:250},
    {drug:'calcium gluconate',order:1,orderUnit:'g',bagAmount:10,bagUnit:'g',bagMl:500}
  ]);
  const conc=c.bagAmount/c.bagMl,a=round(c.order/conc,1);
  return q(`${c.orderUnit}/hr infusion`,`A patient is prescribed ${c.drug} ${c.order} ${c.orderUnit}/hr. The IV contains ${c.bagAmount} ${c.bagUnit} in ${c.bagMl} mL. What pump rate is required?`,a,'mL/hr','ordered amount/hr ÷ amount/mL = mL/hr','Keep the ordered amount and concentration in matching units.',`${c.bagAmount} ${c.bagUnit} ÷ ${c.bagMl} mL = ${round(conc,4)} ${c.bagUnit}/mL\n${c.order} ${c.orderUnit}/hr ÷ ${round(conc,4)} ${c.bagUnit}/mL = ${a} mL/hr`,.06)
}

function meqMl(){
  const c=pick([
    {drug:'potassium chloride',order:20,have:2},
    {drug:'potassium chloride',order:30,have:2},
    {drug:'sodium bicarbonate',order:50,have:1},
    {drug:'potassium acetate',order:10,have:2},
    {drug:'sodium bicarbonate',order:25,have:1}
  ]);
  const a=round(c.order/c.have,1);
  return q('mEq to mL',`The provider orders ${c.drug} ${c.order} mEq. The vial contains ${c.have} mEq/mL. How many mL contain the ordered dose?`,a,'mL','ordered mEq ÷ mEq/mL = mL','Divide the ordered milliequivalents by the concentration in mEq per mL.',`${c.order} mEq ÷ ${c.have} mEq/mL = ${a} mL`,.06)
}

function dailyDivided(){
  const c=pick([
    {drug:'amoxicillin',kg:18,daily:40,freq:'q12h',doses:2},
    {drug:'cephalexin',kg:24,daily:50,freq:'q6h',doses:4},
    {drug:'clindamycin',kg:30,daily:30,freq:'q8h',doses:3},
    {drug:'cefuroxime',kg:20,daily:30,freq:'q12h',doses:2},
    {drug:'acetaminophen',kg:16,daily:60,freq:'q6h',doses:4}
  ]);
  const daily=c.daily*c.kg,a=round(daily/c.doses,1);
  return q('Daily divided dose',`A ${c.kg}-kg patient is prescribed ${c.drug} ${c.daily} mg/kg/day divided ${c.freq}. How many mg should be given per dose?`,a,'mg','mg/kg/day × kg ÷ doses/day = mg per dose','Calculate the total daily dose, then divide by the number of doses given each day.',`${c.daily} mg/kg/day × ${c.kg} kg = ${daily} mg/day\n${daily} mg/day ÷ ${c.doses} doses/day = ${a} mg/dose`,.06)
}

const types=[
['basic-dose','Basic medication dose',basicDose],
['weight-dose','Weight-based dose',weightDose],
['peds-weight-liquid','Pediatric weight-based liquid',pediatricWeightLiquid],
['mlhr-hours','mL/hr — hours',mlhr],
['mlhr-minutes','mL/hr — minutes',mlhrMin],
['infusion-time','Infusion duration',duration],
['completion-time','Completion time',completionTime],
['gtt-volume-time','gtt/min — volume + time',gtt],
['gtt-from-mlhr','mL/hr → gtt/min',gttFromMlhr],
['mlhr-from-gtt','gtt/min → mL/hr',mlhrFromGtt],
['reconstitution','Reconstitution',reconstitution],
['units-hour','Units/hr infusion',unitsHr],
['mcg-minute','mcg/min infusion',mcgMin],
['mcg-kg-minute','mcg/kg/min infusion',mcgKgMin],
['amount-hour','mg/hr or g/hr infusion',amountHr],
['meq-ml','mEq to mL',meqMl],
['daily-divided','Daily divided dose',dailyDivided]
];

const formulas=[
['Basic medication dose','Desired ÷ Have × Quantity = amount to give','Use for tablets, capsules, liquids, and injectable volumes.'],
['Weight-based dose','mg/kg/dose × kg = mg per dose','If ordered mg/kg/day, calculate daily dose first, then divide.'],
['Pediatric weight-based liquid','lb ÷ 2.2 = kg → mg/kg/dose × kg = mg/dose → Desired ÷ Have × Quantity = mL','Use when a pediatric order is weight-based and the medication is supplied as a liquid.'],
['Pump rate — hours','mL ÷ hours = mL/hr','Example: 1,000 mL ÷ 8 hr = 125 mL/hr.'],
['Pump rate — minutes','mL ÷ (minutes ÷ 60) = mL/hr','Convert ordered minutes to hours first.'],
['Infusion duration','mL ÷ mL/hr = hours','Convert decimal hours to minutes when needed.'],
['Completion time','start time + infusion duration = finish time','Carry across midnight when necessary.'],
['Gravity flow','(mL × gtt/mL) ÷ minutes = gtt/min','Convert hours to minutes; round to a whole drop.'],
['Known mL/hr → gtt/min','(mL/hr × gtt/mL) ÷ 60 = gtt/min','Round final answer to a whole drop.'],
['Known gtt/min → mL/hr','(gtt/min × 60) ÷ gtt/mL = mL/hr','Convert gravity rate back to an hourly pump rate.'],
['Reconstitution','ordered dose ÷ resulting concentration = mL to draw','Use the label resulting concentration, not simply diluent added.'],
['Units/hr infusion','ordered units/hr ÷ units/mL = mL/hr','Common heparin- and insulin-style setup.'],
['mcg/min infusion','(mcg/min × 60) ÷ mcg/mL = mL/hr','Convert minute dose to an hourly amount first.'],
['mcg/kg/min infusion','(mcg/kg/min × kg × 60) ÷ mcg/mL = mL/hr','Weight first, then convert minutes to hours.'],
['mg/hr or g/hr infusion','ordered amount/hr ÷ amount/mL = mL/hr','Keep numerator and concentration in matching units.'],
['mEq to mL','ordered mEq ÷ mEq/mL = mL','Used for electrolyte and bicarbonate problems.'],
['Daily divided dose','mg/kg/day × kg ÷ doses/day = mg per dose','q6h=4/day · q8h=3 · q12h=2 · q24h=1.']
];

function welcome(){app.innerHTML=`<h1 class="title">Dosage Calculations</h1><p class="subtitle">How do you want to study?</p><p class="copy">Choose exactly what you want to practice, combine several types, or let the app mix them for you.</p><div class="actions"><button class="text-action" data-a="formulas">Review formulas</button><button class="text-action submit" data-a="setup">Build a session</button></div>`}
function setup(){app.innerHTML=`<h1 class="title">Build a Session</h1><div class="setup"><section class="section"><h3>Mode</h3><div class="choice-row"><label class="choice"><input type="radio" name="mode" value="practice" checked>Practice</label><label class="choice"><input type="radio" name="mode" value="quiz">Quiz</label></div><p class="note"><b>Practice:</b> formula help and worked solution. <b>Quiz:</b> no formula help during the run.</p></section><section class="section"><h3>Question types</h3><div class="type-grid">${types.map(t=>`<label class="choice"><input type="checkbox" name="type" value="${t[0]}">${t[1]}</label>`).join('')}</div><button class="text-action" data-a="mix">Random mix</button></section><section class="section"><h3>Questions</h3><div class="choice-row">${[5,10,15,25].map(n=>`<label class="choice"><input type="radio" name="length" value="${n}" ${n===10?'checked':''}>${n}</label>`).join('')}</div></section></div><p id="msg" class="setup-message"></p><div class="actions"><button class="text-action" data-a="welcome">Back</button><button class="text-action submit" data-a="start">Start session</button></div>`}
function build(){const gens=shuffle(types.filter(t=>selected.includes(t[0])));const out=[];let c=0;while(out.length<length){if(c>=gens.length){c=0;gens.splice(0,gens.length,...shuffle(gens))}out.push(gens[c][2]());c++}return out}
function start(){selected=[...app.querySelectorAll('input[name="type"]:checked')].map(x=>x.value);if(!selected.length){app.querySelector('#msg').textContent='Choose at least one question type, or select Random mix.';return}mode=app.querySelector('input[name="mode"]:checked')?.value||'practice';length=+app.querySelector('input[name="length"]:checked')?.value||10;qs=build();i=0;score=0;renderQ()}
function parseAnswer(s){const m=s.trim().match(/^(-?\d+(?:\.\d+)?)\s*(.*)$/);if(!m)return null;return{n:+m[1],u:m[2].trim().toLowerCase().replace(/\s+/g,'')}}
function normUnit(u){return u.replace('ml/hour','ml/hr').replace('mlhr','ml/hr').replace('gtt/minute','gtt/min').replace('gttmin','gtt/min').replace('hrs','hours').replace(/^hr$/,'hours').replace(/^tablet$/,'tablets')}
function normClock(s){const x=s.trim().replace(/\s+/g,'');const m=x.match(/^(\d{1,2}):?(\d{2})$/);if(!m)return null;const h=+m[1],min=+m[2];if(h>23||min>59)return null;return `${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`}
function renderQ(){answered=false;const x=qs[i],placeholder=x.answerMode==='clock'?'Type 24-hour time, e.g. 16:30':'Type answer with unit, e.g. 4 mL';app.innerHTML=`<div class="meta"><span>${mode==='practice'?'Practice':'Quiz'} · Question ${i+1} of ${length}</span><span>${x.type}</span></div><div class="problem">${x.prompt}</div><div class="answer-row"><input id="answer" class="answer-input" autocomplete="off" placeholder="${placeholder}"><button class="text-action submit" data-a="submit">Submit</button></div>${mode==='practice'?`<div class="actions"><button class="text-action" data-a="hint">See formula</button></div><div id="hint"></div>`:''}<div id="feedback"></div>`;app.querySelector('#answer').focus()}
function submit(){if(answered)return;const x=qs[i],raw=app.querySelector('#answer').value,f=app.querySelector('#feedback');let ok=false;if(x.answerMode==='clock'){const val=normClock(raw);if(!val){f.innerHTML='<div class="feedback incorrect">Enter a valid 24-hour time, such as 16:30.</div>';return}ok=val===x.answer}else{const p=parseAnswer(raw);if(!p){f.innerHTML='<div class="feedback incorrect">Enter a number and the unit.</div>';return}const unitOK=normUnit(p.u)===normUnit(x.unit.toLowerCase().replace(/\s+/g,''));const numOK=Math.abs(p.n-x.answer)<=x.tolerance;ok=unitOK&&numOK}answered=true;if(ok)score++;const shown=x.answerMode==='clock'?x.answer:`${x.answer} ${x.unit}`;f.innerHTML=`<div class="feedback ${ok?'correct':'incorrect'}"><h3>${ok?'Correct':'Incorrect'}</h3><p>${ok?shown:`Correct answer: ${shown}`}</p>${mode==='practice'?`<div class="solution">${x.solution.replace(/\n/g,'<br>')}</div>`:''}<div class="actions"><button class="text-action submit" data-a="next">${i+1<length?'Next question':'See results'}</button></div></div>`}
function next(){i++;if(i>=length)results();else renderQ()}
function results(){const pct=Math.round(score/length*100);app.innerHTML=`<div class="results"><h1 class="title">Session Complete</h1><div class="score">${score}/${length}</div><p class="subtitle">${pct}%</p><div class="actions" style="justify-content:center"><button class="text-action" data-a="setup">Build another session</button><a class="text-action" href="index.html">Home</a></div></div>`}
function showFormulas(page=0){const perPage=9,pages=Math.ceil(formulas.length/perPage),slice=formulas.slice(page*perPage,page*perPage+perPage);app.innerHTML=`<h1 class="title">Formula Review · ${page+1} of ${pages}</h1><div class="formula-grid">${slice.map(x=>`<section class="formula-item"><h3>${x[0]}</h3><div class="equation">${x[1]}</div><p>${x[2]}</p></section>`).join('')}</div><nav class="nav">${page?'<button class="text-action" data-a="fprev">← Previous</button>':'<span></span>'}<button class="text-action" data-a="welcome">Back</button>${page<pages-1?'<button class="text-action" data-a="fnext">Next →</button>':'<span></span>'}</nav>`;app.dataset.formulaPage=page}
app.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;if(a==='welcome')welcome();if(a==='setup')setup();if(a==='mix'){app.querySelectorAll('input[name="type"]').forEach(x=>x.checked=true);app.querySelector('#msg').textContent='Random mix selected — all available types are included.'}if(a==='start')start();if(a==='submit')submit();if(a==='next')next();if(a==='hint'){const x=qs[i];app.querySelector('#hint').innerHTML=`<div class="formula-help"><b>${x.formula}</b><div class="small">${x.note}</div></div>`}if(a==='formulas')showFormulas(0);if(a==='fprev')showFormulas(Math.max(0,(+app.dataset.formulaPage||0)-1));if(a==='fnext')showFormulas((+app.dataset.formulaPage||0)+1)});
app.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='answer'){e.preventDefault();submit()}});
if(location.hash==='#formulas')showFormulas(0);else setup();
})();
