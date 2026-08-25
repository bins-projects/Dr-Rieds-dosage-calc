(() => {
  const E=window.DosageEngine;if(!E||!E.rebuild)return;
  const previous=E.rebuild.bind(E),round=E.round,finalRound=n=>Math.round(Math.trunc((Number(n)+Number.EPSILON)*100)/10)/10;
  E.rebuild=(key,v,current={})=>{
    if(key==='weight-dose'){
      const a=round(v.kg*v.dose,1),who=v.context?`${v.kg}-kg ${v.context}`:`${v.kg}-kg patient`;
      return {...current,key,type:'Weight-based dose',vars:v,answer:a,unit:'mg',prompt:`A ${who} is prescribed ${v.drug} ${v.dose} mg/kg/dose ${v.route}. How many mg should the patient receive per dose?`,formula:'mg/kg/dose × kg = mg per dose',note:'Multiply the medication-specific dose by the patient weight; keep the route and frequency matched to the scenario.',solution:`${v.dose} mg/kg × ${v.kg} kg = ${a} mg/dose`};
    }
    if(key==='peds-safe-range'){
      const perDose=v.doseKind==='per-dose',minRaw=perDose?v.kg*v.minDay:v.kg*v.minDay/v.doses,maxWeightRaw=perDose?v.kg*v.maxDay:v.kg*v.maxDay/v.doses,maxRaw=v.maxDaily?Math.min(maxWeightRaw,v.maxDaily/v.doses):maxWeightRaw,min=round(minRaw,1),max=round(maxRaw,1),minMl=finalRound(minRaw*v.qty/v.have),maxMl=finalRound(maxRaw*v.qty/v.have),safety=v.order<minRaw?'too low':v.order>maxRaw?'too high':'safe',ml=finalRound(v.order*v.qty/v.have),nv={...v,min,max,minRaw,maxRaw,minMl,maxMl,ml,safety},route=v.route||(`PO ${v.freq||''}`.trim()),rangeText=perDose?`${v.minDay}–${v.maxDay} mg/kg/dose`:`${v.minDay}–${v.maxDay} mg/kg/day in ${v.doses} equal doses`,safetyLabel=safety==='safe'?'Safe':safety==='too low'?'Too low':'Too high';
      return {...current,key,type:'Pediatric safe-dose range',vars:nv,answer:safety,unit:'',prompt:`A child weighs ${v.kg} kg${v.context?` and is being treated for ${v.context}`:''}. The provider orders ${v.drug} ${v.order} mg ${route}. Recommended: ${rangeText}${v.maxDaily?`, maximum ${v.maxDaily} mg/day`:''}. Available: ${v.have} mg/${v.qty} mL. Calculate the volume and determine whether the order is safe, too low, or too high.`,formula:perDose?'mg/kg/dose × kg = safe mg/dose range':'mg/kg/day × kg ÷ doses/day = safe mg/dose range',note:'Calculate both ends using unrounded values, classify the ordered dose in mg, then convert both the safe range and ordered dose to mL.',solution:`Safe dose range: ${min}–${max} mg/dose.\nSafe volume range: ${minMl.toFixed(1)}–${maxMl.toFixed(1)} mL/dose.\nOrdered dose: ${v.order} mg = ${ml.toFixed(1)} mL.\nFinal answer: ${ml.toFixed(1)} mL — ${safetyLabel}.`};
    }
    if(key==='daily-divided'){
      const day=round(v.daily*v.kg,1),a=round(day/v.doses,1);
      return {...current,key,type:'Daily divided dose',vars:v,answer:a,unit:'mg/dose',prompt:`A ${v.kg}-kg child is prescribed ${v.drug} ${v.daily} mg/kg/day${v.context?` for ${v.context}`:''}, divided ${v.freq}. How many mg should be given per dose?`,formula:'mg/kg/day × kg ÷ doses/day = mg/dose',note:'Use the medication-specific daily dose and the number of scheduled doses in 24 hours.',solution:`${v.daily} × ${v.kg} = ${day} mg/day; ${day} ÷ ${v.doses} = ${a} mg/dose`};
    }
    return previous(key,v,current);
  };
})();
