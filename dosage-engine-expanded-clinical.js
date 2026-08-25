(() => {
  const E=window.DosageEngine;if(!E)return;
  const previous=E.generate.bind(E),pick=a=>a[Math.floor(Math.random()*a.length)],round=E.round,finalRound=E.finalRound||((n)=>Math.round(n*10)/10);
  const q=(key,type,prompt,answer,unit,formula,note,solution,tolerance=.05,vars={})=>({key,type,prompt,answer,unit,formula,note,solution,tolerance,vars});
  const randDec=(min,max,p=1)=>round(min+Math.random()*(max-min),p);

  const weightCases={
    easy:[
      {drug:'acetaminophen',dose:15,route:'IV q6h',context:'child age 2–12 years',minKg:12,maxKg:35,have:100,qty:10,supply:'100 mg/10 mL'},
      {drug:'ibuprofen',dose:10,route:'PO q6–8h',context:'child with mild-to-moderate pain',minKg:7,maxKg:15,have:100,qty:5,supply:'100 mg/5 mL'},
      {drug:'ceftriaxone',dose:50,route:'IM once',context:'child with acute bacterial otitis media',minKg:8,maxKg:18,have:350,qty:1,supply:'350 mg/mL after IM reconstitution'},
      {drug:'cefdinir',dose:7,route:'PO q12h',context:'child with an indicated respiratory/ENT infection',minKg:9,maxKg:36,have:250,qty:5,supply:'250 mg/5 mL'}
    ],
    standard:[
      {drug:'acetaminophen',dose:12.5,route:'IV q4h',context:'child age 2–12 years',minKg:12,maxKg:35,have:100,qty:10,supply:'100 mg/10 mL'},
      {drug:'acetaminophen',dose:15,route:'IV q6h',context:'child age 2–12 years',minKg:12,maxKg:35,have:100,qty:10,supply:'100 mg/10 mL'},
      {drug:'ibuprofen',dose:10,route:'PO q6–8h',context:'child with mild-to-moderate pain',minKg:7,maxKg:15,have:100,qty:5,supply:'100 mg/5 mL'},
      {drug:'ceftriaxone',dose:50,route:'IM once',context:'child with acute bacterial otitis media',minKg:8,maxKg:18,have:350,qty:1,supply:'350 mg/mL after IM reconstitution'},
      {drug:'cefdinir',dose:7,route:'PO q12h',context:'child with an indicated respiratory/ENT infection',minKg:9,maxKg:36,have:250,qty:5,supply:'250 mg/5 mL'},
      {drug:'azithromycin',dose:10,route:'PO q24h',context:'day 1 of a pediatric 5-day respiratory regimen',minKg:6,maxKg:40,have:200,qty:5,supply:'200 mg/5 mL'}
    ],
    challenge:[
      {drug:'acetaminophen',dose:12.5,route:'IV q4h',context:'child age 2–12 years',minKg:12,maxKg:35,have:100,qty:10,supply:'100 mg/10 mL'},
      {drug:'ceftriaxone',dose:50,route:'IM once',context:'child with acute bacterial otitis media',minKg:8,maxKg:19,have:350,qty:1,supply:'350 mg/mL after IM reconstitution'},
      {drug:'cefdinir',dose:7,route:'PO q12h',context:'child with an indicated respiratory/ENT infection',minKg:9,maxKg:36,have:250,qty:5,supply:'250 mg/5 mL'},
      {drug:'azithromycin',dose:12,route:'PO q24h',context:'pediatric pharyngitis/tonsillitis regimen',minKg:6,maxKg:40,have:200,qty:5,supply:'200 mg/5 mL'}
    ]
  };

  const safeCases=[
    {drug:'ceftriaxone',context:'serious pediatric infection other than meningitis',route:'IV q12h',minDay:50,maxDay:75,doses:2,have:100,qty:1,minKg:8,maxKg:26,maxDaily:2000},
    {drug:'ibuprofen',context:'juvenile arthritis',route:'PO',minDay:30,maxDay:40,doses:4,have:100,qty:5,minKg:10,maxKg:30,maxDaily:null}
  ];

  const dividedCases=[
    {drug:'amoxicillin',context:'mild/moderate infection',daily:20,doses:3,freq:'q8h',have:250,qty:5},
    {drug:'amoxicillin',context:'mild/moderate infection',daily:25,doses:2,freq:'q12h',have:250,qty:5},
    {drug:'amoxicillin',context:'severe infection',daily:40,doses:3,freq:'q8h',have:250,qty:5},
    {drug:'amoxicillin',context:'severe or lower respiratory infection',daily:45,doses:2,freq:'q12h',have:400,qty:5},
    {drug:'amoxicillin/clavulanate',context:'pediatric infection; dose based on amoxicillin component',daily:45,doses:2,freq:'q12h',have:400,qty:5},
    {drug:'amoxicillin/clavulanate',context:'pediatric infection; dose based on amoxicillin component',daily:40,doses:3,freq:'q8h',have:125,qty:5},
    {drug:'amoxicillin/clavulanate',context:'high-dose pediatric suspension regimen; dose based on amoxicillin component',daily:90,doses:2,freq:'q12h',have:600,qty:5},
    {drug:'cefdinir',context:'pediatric respiratory/ENT infection',daily:14,doses:2,freq:'q12h',have:250,qty:5},
    {drug:'cefuroxime axetil',context:'pediatric pharyngitis/tonsillitis',daily:20,doses:2,freq:'q12h',have:250,qty:5},
    {drug:'cefuroxime axetil',context:'pediatric otitis media/sinusitis/impetigo',daily:30,doses:2,freq:'q12h',have:250,qty:5}
  ];

  function weightDose(d){const c=pick(weightCases[d]||weightCases.standard),kg=d==='easy'?Math.round(randDec(c.minKg,c.maxKg,0)):randDec(c.minKg,c.maxKg,1),mg=kg*c.dose,a=finalRound(mg*c.qty/c.have);return q('weight-dose','Weight-based dose',`A ${kg}-kg ${c.context} is prescribed ${c.drug} ${c.dose} mg/kg/dose ${c.route}. Available: ${c.supply}. How many mL should the nurse administer per dose?`,a,'mL','mg/kg/dose × kg, then desired mg ÷ mg on hand × mL = mL per dose','Calculate the prescribed dose in mg, then convert it to the available liquid or reconstituted concentration.',`${c.dose} mg/kg × ${kg} kg = ${round(mg,2)} mg/dose; (${round(mg,2)} mg ÷ ${c.have} mg) × ${c.qty} mL = ${a} mL/dose`,.05,{drug:c.drug,context:c.context,kg,dose:c.dose,route:c.route,have:c.have,qty:c.qty,mg})}

  function pedsSafe(d){const c=pick(safeCases),kg=d==='easy'?Math.round(randDec(c.minKg,c.maxKg,0)):randDec(c.minKg,c.maxKg,1),minRaw=kg*c.minDay/c.doses,maxWeightRaw=kg*c.maxDay/c.doses,maxRaw=c.maxDaily?Math.min(maxWeightRaw,c.maxDaily/c.doses):maxWeightRaw,target=pick(['low','safe','high']);let order;if(target==='low')order=Math.max(5,Math.round((minRaw-Math.max(5,minRaw*.15))/5)*5);else if(target==='high')order=Math.round((maxRaw+Math.max(5,maxRaw*.15))/5)*5;else order=Math.round(randDec(minRaw,maxRaw,2)/5)*5;const safety=order<minRaw?'too low':order>maxRaw?'too high':'safe',ml=finalRound(order*c.qty/c.have),min=finalRound(minRaw),max=finalRound(maxRaw);return q('peds-safe-range','Pediatric safe-dose range',`A child weighs ${kg} kg and is being treated for ${c.context}. The provider orders ${c.drug} ${order} mg ${c.route}. Recommended: ${c.minDay}–${c.maxDay} mg/kg/day in ${c.doses} equal doses${c.maxDaily?`, maximum ${c.maxDaily} mg/day`:''}. Available: ${c.have} mg/${c.qty} mL. Calculate the volume and determine whether the order is safe, too low, or too high.`,safety,'','mg/kg/day × kg ÷ doses/day = safe mg/dose range; ordered mg ÷ mg on hand × mL = ordered volume','Calculate both ends using unrounded values, classify the ordered dose, then convert the order to mL.',`Safe range: ${min}–${max} mg/dose. Order ${order} mg is ${safety}. (${order} ÷ ${c.have}) × ${c.qty} = ${ml} mL. Final: ${ml} mL — ${safety}.`,.05,{drug:c.drug,context:c.context,kg,order,route:c.route,doses:c.doses,minDay:c.minDay,maxDay:c.maxDay,have:c.have,qty:c.qty,min,max,minRaw,maxRaw,ml,safety,maxDaily:c.maxDaily})}

  function dailyDivided(d){const c=pick(dividedCases),kg=d==='easy'?Math.round(randDec(10,30,0)):randDec(10,38,1),day=c.daily*kg,mg=day/c.doses,a=finalRound(mg*c.qty/c.have);return q('daily-divided','Daily divided dose',`A ${kg}-kg child is prescribed ${c.drug} ${c.daily} mg/kg/day for ${c.context}, divided ${c.freq}. Available: ${c.have} mg/${c.qty} mL. How many mL should be given per dose?`,a,'mL','mg/kg/day × kg ÷ doses/day, then desired mg ÷ mg on hand × mL = mL/dose','Calculate the total daily dose, divide it into scheduled doses, then convert the per-dose amount to mL.',`${c.daily} × ${kg} = ${round(day,2)} mg/day; ${round(day,2)} ÷ ${c.doses} = ${round(mg,2)} mg/dose; (${round(mg,2)} ÷ ${c.have}) × ${c.qty} = ${a} mL/dose`,.05,{drug:c.drug,context:c.context,kg,daily:c.daily,doses:c.doses,freq:c.freq,have:c.have,qty:c.qty,day,mg})}

  E.generate=(key,d='standard')=>key==='weight-dose'?weightDose(d):key==='peds-safe-range'?pedsSafe(d):key==='daily-divided'?dailyDivided(d):previous(key,d);
  E.version=4;
})();
