(() => {
  const E=window.DosageEngine;if(!E)return;
  const previous=E.generate.bind(E),pick=a=>a[Math.floor(Math.random()*a.length)],round=E.round;
  const q=(key,type,prompt,answer,unit,formula,note,solution,tolerance=.05,vars={})=>({key,type,prompt,answer,unit,formula,note,solution,tolerance,vars});
  const randDec=(min,max,p=1)=>round(min+Math.random()*(max-min),p);
  // Pediatric class rule: round every completed calculation to hundredths,
  // then carry that rounded result into the next calculation.
  const pedsRound=n=>round(n,2);
  const pedsVolume=(dose,have,qty)=>pedsRound(pedsRound(dose/have)*qty);
  const frequencyFor=doses=>({1:'q24h',2:'q12h',3:'q8h',4:'q6h',6:'q4h'}[doses]||`in ${doses} equal doses`);
  const routeOnly=route=>String(route||'').replace(/\bq\d+(?:–\d+)?h\b/gi,'').trim();

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

  function weightDose(d){const c=pick(weightCases[d]||weightCases.standard),kg=d==='easy'?Math.round(randDec(c.minKg,c.maxKg,0)):randDec(c.minKg,c.maxKg,1),a=pedsRound(kg*c.dose);return q('weight-dose','Weight-based dose',`A ${kg}-kg ${c.context} is prescribed ${c.drug} ${c.dose} mg/kg/dose ${c.route}. How many mg should the patient receive per dose?`,a,'mg','mg/kg/dose × kg = mg per dose','Round the completed pediatric calculation to the nearest hundredth.',`${c.dose} mg/kg × ${kg} kg = ${a.toFixed(2)} mg/dose`,.006,{drug:c.drug,context:c.context,kg,dose:c.dose,route:c.route})}

  function pedsSafe(d){
    const c=pick(safeCases),kg=d==='easy'?Math.round(randDec(c.minKg,c.maxKg,0)):randDec(c.minKg,c.maxKg,1),perDose=c.doseKind==='per-dose';
    const minDaily=pedsRound(kg*c.minDay),maxWeightDaily=pedsRound(kg*c.maxDay),maxDaily=c.maxDaily?pedsRound(Math.min(maxWeightDaily,c.maxDaily)):maxWeightDaily;
    const min=perDose?minDaily:pedsRound(minDaily/c.doses),max=perDose?maxDaily:pedsRound(maxDaily/c.doses);
    const minMl=pedsVolume(min,c.have,c.qty),maxMl=pedsVolume(max,c.have,c.qty),target=pick(['low','safe','high']),orderBasis=pick(['per-dose','daily']);
    let selectedDose;if(target==='low')selectedDose=Math.max(5,Math.round((min-Math.max(5,min*.15))/5)*5);else if(target==='high')selectedDose=Math.round((max+Math.max(5,max*.15))/5)*5;else selectedDose=Math.round(randDec(min,max,2)/5)*5;
    const order=orderBasis==='daily'?pedsRound(selectedDose*c.doses):selectedDose,orderDose=orderBasis==='daily'?pedsRound(order/c.doses):pedsRound(order),orderedDaily=orderBasis==='daily'?pedsRound(order):pedsRound(orderDose*c.doses);
    const safety=orderDose<min?'too low':orderDose>max?'too high':'safe',ml=pedsVolume(orderDose,c.have,c.qty),rangeText=perDose?`${c.minDay}–${c.maxDay} mg/kg/dose`:`${c.minDay}–${c.maxDay} mg/kg/day in ${c.doses} equal doses`,safetyLabel=safety==='safe'?'Safe':safety==='too low'?'Too low':'Too high';
    const minWork=perDose?`${c.minDay} × ${kg} = ${min.toFixed(2)} mg/dose`:`${c.minDay} × ${kg} = ${minDaily.toFixed(2)} mg/day; ${minDaily.toFixed(2)} ÷ ${c.doses} = ${min.toFixed(2)} mg/dose`;
    const maxWork=perDose?`${c.maxDay} × ${kg} = ${max.toFixed(2)} mg/dose`:`${c.maxDay} × ${kg} = ${maxWeightDaily.toFixed(2)} mg/day; ${maxDaily.toFixed(2)} ÷ ${c.doses} = ${max.toFixed(2)} mg/dose`;
    const volumeRatio=pedsRound(orderDose/c.have),orderStatement=orderBasis==='daily'?`${order.toFixed(2)} mg/day ${routeOnly(c.route)}, divided ${frequencyFor(c.doses)}`:`${order.toFixed(2)} mg/dose ${c.route}`,orderWork=orderBasis==='daily'?`Ordered daily dose: ${order.toFixed(2)} mg/day; ${order.toFixed(2)} ÷ ${c.doses} = ${orderDose.toFixed(2)} mg/dose`:`Ordered dose: ${order.toFixed(2)} mg/dose; ${order.toFixed(2)} × ${c.doses} = ${orderedDaily.toFixed(2)} mg/day`;
    return q('peds-safe-range','Pediatric safe-dose range',`A child weighs ${kg} kg and is being treated for ${c.context}. The provider orders ${c.drug} ${orderStatement}. Recommended: ${rangeText}${c.maxDaily?`, maximum ${c.maxDaily} mg/day`:''}. Available: ${c.have} mg/${c.qty} mL. Calculate the volume per dose and determine whether the order is safe, too low, or too high.`,safety,'',perDose?'mg/kg/dose × kg = safe mg/dose range':'mg/kg/day × kg ÷ doses/day = safe mg/dose range','Identify whether the order is written per dose or per day, convert it to mg/dose, then compare. Round each completed pediatric calculation to the nearest hundredth and carry that result into the next step.',`Minimum: ${minWork}.\nMaximum: ${maxWork}.\nSafe dose range: ${min.toFixed(2)}–${max.toFixed(2)} mg/dose.\nSafe volume range: ${minMl.toFixed(2)}–${maxMl.toFixed(2)} mL/dose.\n${orderWork}.\nComparison: ${orderDose.toFixed(2)} mg/dose is ${safetyLabel.toLowerCase()}.\nVolume per dose: ${orderDose.toFixed(2)} ÷ ${c.have} = ${volumeRatio.toFixed(2)}; ${volumeRatio.toFixed(2)} × ${c.qty} = ${ml.toFixed(2)} mL.\nFinal answer: ${ml.toFixed(2)} mL — ${safetyLabel}.`,.006,{drug:c.drug,context:c.context,kg,orderBasis,order,orderDose,orderedDaily,route:c.route,doses:c.doses,minDay:c.minDay,maxDay:c.maxDay,doseKind:c.doseKind,have:c.have,qty:c.qty,min,max,minRaw:min,maxRaw:max,minDaily,maxDailyRounded:maxDaily,minMl,maxMl,volumeRatio,ml,safety,maxDaily:c.maxDaily})
  }

  function dailyDivided(d){const c=pick(dividedCases),kg=d==='easy'?Math.round(randDec(10,30,0)):randDec(10,38,1),day=pedsRound(c.daily*kg),a=pedsRound(day/c.doses);return q('daily-divided','Daily divided dose',`A ${kg}-kg child is prescribed ${c.drug} ${c.daily} mg/kg/day for ${c.context}, divided ${c.freq}. How many mg should be given per dose?`,a,'mg/dose','mg/kg/day × kg ÷ doses/day = mg/dose','Round each completed pediatric calculation to the nearest hundredth and carry it into the next step.',`${c.daily} × ${kg} = ${day.toFixed(2)} mg/day; ${day.toFixed(2)} ÷ ${c.doses} = ${a.toFixed(2)} mg/dose`,.006,{drug:c.drug,context:c.context,kg,daily:c.daily,doses:c.doses,freq:c.freq,day})}

  E.generate=(key,d='standard')=>key==='weight-dose'?weightDose(d):key==='peds-safe-range'?pedsSafe(d):key==='daily-divided'?dailyDivided(d):previous(key,d);
  E.version=4;
})();
