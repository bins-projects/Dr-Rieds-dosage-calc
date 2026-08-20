(() => {
  const E=window.DosageEngine;if(!E||!E.rebuild)return;
  const previous=E.rebuild.bind(E),round=E.round;
  E.rebuild=(key,v,current={})=>{
    if(key==='mcg-kg-hour'){
      const conc=v.bagMcg/v.bagMl,a=round(v.dose*v.kg/conc,1);
      return {...current,key,type:'mcg/kg/hr infusion',vars:v,answer:a,unit:'mL/hr',prompt:`A ${v.kg}-kg adult is receiving ${v.drug||'dexmedetomidine'} for ICU sedation at ${v.dose} mcg/kg/hr. The IV contains ${v.bagMcg} mcg in ${v.bagMl} mL. What pump rate is required?`,formula:'(mcg/kg/hr × kg) ÷ mcg/mL = mL/hr',note:'Because the order is already per hour, do not multiply by 60.',solution:`${v.dose} × ${v.kg} = ${round(v.dose*v.kg,2)} mcg/hr; ${v.bagMcg} ÷ ${v.bagMl} = ${round(conc,2)} mcg/mL; ${round(v.dose*v.kg,2)} ÷ ${round(conc,2)} = ${a} mL/hr`};
    }
    return previous(key,v,current);
  };
})();