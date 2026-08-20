(() => {
  const E=window.DosageEngine;if(!E||!E.rebuild)return;
  const previous=E.rebuild.bind(E),round=E.round;
  E.rebuild=(key,v,current={})=>{
    if(key==='weight-dose'){
      const a=round(v.kg*v.dose,1),who=v.context?`${v.kg}-kg ${v.context}`:`${v.kg}-kg patient`;
      return {...current,key,type:'Weight-based dose',vars:v,answer:a,unit:'mg',prompt:`A ${who} is prescribed ${v.drug} ${v.dose} mg/kg/dose ${v.route}. How many mg should the patient receive per dose?`,formula:'mg/kg/dose × kg = mg per dose',note:'Multiply the medication-specific dose by the patient weight; keep the route and frequency matched to the scenario.',solution:`${v.dose} mg/kg × ${v.kg} kg = ${a} mg/dose`};
    }
    if(key==='peds-safe-range'){
      const min=round(v.kg*v.minDay/v.doses,1),uncappedMax=round(v.kg*v.maxDay/v.doses,1),max=v.maxDaily?Math.min(uncappedMax,v.maxDaily/v.doses):uncappedMax,safety=v.order<min?'too low':v.order>max?'too high':'safe',ml=round(v.order*v.qty/v.have,1),nv={...v,min,max,ml,safety},route=v.route||(`PO ${v.freq||''}`.trim());
      return {...current,key,type:'Pediatric safe-dose range',vars:nv,answer:safety,unit:'',prompt:`A child weighs ${v.kg} kg${v.context?` and is being treated for ${v.context}`:''}. The provider orders ${v.drug} ${v.order} mg ${route}. Recommended: ${v.minDay}–${v.maxDay} mg/kg/day in ${v.doses} equal doses${v.maxDaily?`, maximum ${v.maxDaily} mg/day`:''}. Available: ${v.have} mg/${v.qty} mL. Is the ordered dose safe, too low, or too high?`,formula:'mg/kg/day × kg ÷ doses/day = safe mg/dose range',note:'Calculate both ends of the medication-specific range and apply any stated daily maximum before comparing the order.',solution:`Safe range: ${min}–${max} mg/dose. Order ${v.order} mg is ${safety}.${safety==='safe'?` Amount: (${v.order} ÷ ${v.have}) × ${v.qty} = ${ml} mL.`:''}`};
    }
    if(key==='daily-divided'){
      const day=round(v.daily*v.kg,1),a=round(day/v.doses,1);
      return {...current,key,type:'Daily divided dose',vars:v,answer:a,unit:'mg/dose',prompt:`A ${v.kg}-kg child is prescribed ${v.drug} ${v.daily} mg/kg/day${v.context?` for ${v.context}`:''}, divided ${v.freq}. How many mg should be given per dose?`,formula:'mg/kg/day × kg ÷ doses/day = mg/dose',note:'Use the medication-specific daily dose and the number of scheduled doses in 24 hours.',solution:`${v.daily} × ${v.kg} = ${day} mg/day; ${day} ÷ ${v.doses} = ${a} mg/dose`};
    }
    return previous(key,v,current);
  };
})();