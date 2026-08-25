(() => {
  const E=window.DosageEngine;if(!E)return;
  const previous=E.generate.bind(E),pick=a=>a[Math.floor(Math.random()*a.length)],round=E.round;
  const q=(key,type,prompt,answer,unit,formula,note,solution,tolerance=.05,vars={})=>({key,type,prompt,answer,unit,formula,note,solution,tolerance,vars});
  const randDec=(min,max,p=1)=>round(min+Math.random()*(max-min),p);

  const weightCases={
    easy:[
      {drug:'acetaminophen',dose:15,route:'IV q6h',context:'child age 2–12 years',minKg:12,maxKg:35},
      {drug:'ibuprofen',dose:10,route:'PO q6–8h',context:'child with mild-to-moderate pain',minKg:7,maxKg:15},
      {drug:'ceftriaxone',dose:50,route:'IM once',context:'child with acute bacterial otitis media',minKg:8,maxKg:18},
      {drug:'acyclovir',dose:10,route:'IV q8h',context:'pediatric mucocutaneous HSV infection',minKg:10,maxKg:35},
      {drug:'cefdinir',dose:7,route:'PO q12h',context:'child with an indicated respiratory/ENT infection',minKg:9,maxKg:36}
    ],
    standard:[
      {drug:'acetaminophen',dose:12.5,route:'IV q4h',context:'child age 2–12 years',minKg:12,maxKg:35},
      {drug:'acetaminophen',dose:15,route:'IV q6h',context:'child age 2–12 years',minKg:12,maxKg:35},
      {drug:'ibuprofen',dose:10,route:'PO q6–8h',context:'child with mild-to-moderate pain',minKg:7,maxKg:15},
      {drug:'ceftriaxone',dose:50,route:'IM once',context:'child with acute bacterial otitis media',minKg:8,maxKg:18},
      {drug:'acyclovir',dose:10,route:'IV q8h',context:'pediatric mucocutaneous HSV infection',minKg:10,maxKg:35},
      {drug:'acyclovir',dose:20,route:'IV q8h',context:'pediatric herpes simplex encephalitis',minKg:10,maxKg:35},
      {drug:'cefdinir',dose:7,route:'PO q12h',context:'child with an indicated respiratory/ENT infection',minKg:9,maxKg:36},
      {drug:'azithromycin',dose:10,route:'PO q24h',context:'day 1 of a pediatric 5-day respiratory regimen',minKg:6,maxKg:40}
    ],
    challenge:[
      {drug:'acetaminophen',dose:12.5,route:'IV q4h',context:'child age 2–12 years',minKg:12,maxKg:35},
      {drug:'ceftriaxone',dose:50,route:'IM once',context:'child with acute bacterial otitis media',minKg:8,maxKg:19},
      {drug:'acyclovir',dose:10,route:'IV q8h',context:'pediatric mucocutaneous HSV infection',minKg:10,maxKg:35},
      {drug:'acyclovir',dose:20,route:'IV q8h',context:'pediatric herpes simplex encephalitis',minKg:10,maxKg:35},
      {drug:'cefdinir',dose:7,route:'PO q12h',context:'child with an indicated respiratory/ENT infection',minKg:9,maxKg:36},
      {drug:'azithromycin',dose:12,route:'PO q24h',context:'pediatric pharyngitis/tonsillitis regimen',minKg:6,maxKg:40}
    ]
  };

  const safeCases=[
    {drug:'ceftriaxone',context:'a serious bacterial infection',route:'IV q12h',doseKind:'daily',minDay:50,maxDay:75,doses:2,have:100,qty:1,minKg:8,maxKg:26,maxDaily:2000},
    {drug:'ibuprofen',context:'juvenile idiopathic arthritis',route:'PO q6h',doseKind:'daily',minDay:30,maxDay:40,doses:4,have:100,qty:5,minKg:10,maxKg:30,maxDaily:null},
    {drug:'cefazolin',context:'a mild-to-moderate bacterial infection',route:'IV q8h',doseKind:'daily',minDay:25,maxDay:50,doses:3,have:100,qty:1,minKg:8,maxKg:32,maxDaily:null},
    {drug:'clindamycin',context:'a serious bacterial infection',route:'IV q8h',doseKind:'daily',minDay:20,maxDay:40,doses:3,have:150,qty:1,minKg:8,maxKg:32,maxDaily:null},
    {drug:'ceftazidime',context:'a susceptible bacterial infection',route:'IV q8h',doseKind:'per-dose',minDay:30,maxDay:50,doses:3,have:100,qty:1,minKg:8,maxKg:32,maxDaily:6000},
    {drug:'gentamicin',context:'a serious gram-negative infection with normal renal function',route:'IV q8h',doseKind:'daily',minDay:6,maxDay:7.5,doses:3,have:40,qty:1,minKg:8,maxKg:32,maxDaily:null},
    {drug:'tobramycin',context:'a serious bacterial infection with normal renal function',route:'IV q8h',doseKind:'daily',minDay:6,maxDay:7.5,doses:3,have:40,qty:1,minKg:8,maxKg:32,maxDaily:null},
    {drug:'cephalexin',context:'a routine bacterial infection',route:'PO q6h',doseKind:'daily',minDay:25,maxDay:50,doses:4,have:250,qty:5,minKg:8,maxKg:32,maxDaily:null}
  ];

  const dividedCases=[
    {drug:'amoxicillin',context:'mild/moderate infection',daily:20,doses:3,freq:'q8h'},
    {drug:'amoxicillin',context:'mild/moderate infection',daily:25,doses:2,freq:'q12h'},
    {drug:'amoxicillin',context:'severe infection',daily:40,doses:3,freq:'q8h'},
    {drug:'amoxicillin',context:'severe or lower respiratory infection',daily:45,doses:2,freq:'q12h'},
    {drug:'amoxicillin/clavulanate',context:'pediatric infection; dose based on amoxicillin component',daily:45,doses:2,freq:'q12h'},
    {drug:'amoxicillin/clavulanate',context:'pediatric infection; dose based on amoxicillin component',daily:40,doses:3,freq:'q8h'},
    {drug:'amoxicillin/clavulanate',context:'high-dose pediatric suspension regimen; dose based on amoxicillin component',daily:90,doses:2,freq:'q12h'},
    {drug:'cefdinir',context:'pediatric respiratory/ENT infection',daily:14,doses:2,freq:'q12h'},
    {drug:'cefuroxime axetil',context:'pediatric pharyngitis/tonsillitis',daily:20,doses:2,freq:'q12h'},
    {drug:'cefuroxime axetil',context:'pediatric otitis media/sinusitis/impetigo',daily:30,doses:2,freq:'q12h'}
  ];

  function weightDose(d){const c=pick(weightCases[d]||weightCases.standard),kg=d==='easy'?Math.round(randDec(c.minKg,c.maxKg,0)):randDec(c.minKg,c.maxKg,1),a=round(kg*c.dose,1);return q('weight-dose','Weight-based dose',`A ${kg}-kg ${c.context} is prescribed ${c.drug} ${c.dose} mg/kg/dose ${c.route}. How many mg should the patient receive per dose?`,a,'mg','mg/kg/dose × kg = mg per dose','Multiply the medication-specific dose by the patient weight; the scenario supplies the appropriate route and frequency.',`${c.dose} mg/kg × ${kg} kg = ${a} mg/dose`,.06,{drug:c.drug,context:c.context,kg,dose:c.dose,route:c.route})}

  function pedsSafe(d){const c=pick(safeCases),kg=d==='easy'?Math.round(randDec(c.minKg,c.maxKg,0)):randDec(c.minKg,c.maxKg,1),perDose=c.doseKind==='per-dose',minRaw=perDose?kg*c.minDay:kg*c.minDay/c.doses,maxWeightRaw=perDose?kg*c.maxDay:kg*c.maxDay/c.doses,maxRaw=c.maxDaily?Math.min(maxWeightRaw,c.maxDaily/c.doses):maxWeightRaw,min=round(minRaw,1),max=round(maxRaw,1),target=pick(['low','safe','high']);let order;if(target==='low')order=Math.max(5,Math.round((minRaw-Math.max(5,minRaw*.15))/5)*5);else if(target==='high')order=Math.round((maxRaw+Math.max(5,maxRaw*.15))/5)*5;else order=Math.round(randDec(minRaw,maxRaw,1)/5)*5;const safety=order<minRaw?'too low':order>maxRaw?'too high':'safe',ml=round(order*c.qty/c.have,1),rangeText=perDose?`${c.minDay}–${c.maxDay} mg/kg/dose`:`${c.minDay}–${c.maxDay} mg/kg/day in ${c.doses} equal doses`;return q('peds-safe-range','Pediatric safe-dose range',`A child weighs ${kg} kg and is being treated for ${c.context}. The provider orders ${c.drug} ${order} mg ${c.route}. Recommended: ${rangeText}${c.maxDaily?`, maximum ${c.maxDaily} mg/day`:''}. Available: ${c.have} mg/${c.qty} mL. Calculate the volume and determine whether the order is safe, too low, or too high.`,safety,'',perDose?'mg/kg/dose × kg = safe mg/dose range':'mg/kg/day × kg ÷ doses/day = safe mg/dose range','Calculate both ends using unrounded values, classify the ordered dose, then convert the ordered dose to mL.',`Safe range: ${min}–${max} mg/dose. Order ${order} mg is ${safety}. (${order} ÷ ${c.have}) × ${c.qty} = ${ml} mL. Final answer: ${ml} mL — ${safety}.`,.05,{drug:c.drug,context:c.context,kg,order,route:c.route,doses:c.doses,minDay:c.minDay,maxDay:c.maxDay,doseKind:c.doseKind,have:c.have,qty:c.qty,min,max,minRaw,maxRaw,ml,safety,maxDaily:c.maxDaily})}

  function dailyDivided(d){const c=pick(dividedCases),kg=d==='easy'?Math.round(randDec(10,30,0)):randDec(10,38,1),day=round(c.daily*kg,1),a=round(day/c.doses,1);return q('daily-divided','Daily divided dose',`A ${kg}-kg child is prescribed ${c.drug} ${c.daily} mg/kg/day for ${c.context}, divided ${c.freq}. How many mg should be given per dose?`,a,'mg/dose','mg/kg/day × kg ÷ doses/day = mg/dose','Use the medication-specific daily dose and the number of scheduled doses in 24 hours.',`${c.daily} × ${kg} = ${day} mg/day; ${day} ÷ ${c.doses} = ${a} mg/dose`,.05,{drug:c.drug,context:c.context,kg,daily:c.daily,doses:c.doses,freq:c.freq})}

  E.generate=(key,d='standard')=>key==='weight-dose'?weightDose(d):key==='peds-safe-range'?pedsSafe(d):key==='daily-divided'?dailyDivided(d):previous(key,d);
  E.version=4;
})();
