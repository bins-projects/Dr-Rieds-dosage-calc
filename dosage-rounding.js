(() => {
  const E=window.DosageEngine;if(!E)return;
  const previous=E.generate.bind(E);
  const wholeNumberUnits=new Set(['gtt/min']);
  const discreteUnits=new Set(['tablet','tablets','capsule','capsules']);
  const rawAnswer=x=>{const v=x.vars||{};switch(x.key){
    case'basic-dose':return v.order/v.have*v.qty;
    case'weight-dose':return v.dose*v.kg*v.qty/v.have;
    case'daily-divided':return v.daily*v.kg/v.doses*v.qty/v.have;
    case'mlhr-hours':return v.volume/v.hours;
    case'mlhr-minutes':return v.volume/(v.minutes/60);
    case'infusion-time':return v.volume/v.rate;
    case'mlhr-from-gtt':return v.dropsPerMinute*60/v.dropFactor;
    case'reconstitution':return v.order/v.conc;
    case'units-hour':return v.order/(v.bagUnits/v.bagMl);
    case'mcg-minute':return v.order*60/(v.bagMcg/v.bagMl);
    case'mcg-kg-minute':return v.dose*v.kg*60/(v.bagMcg/v.bagMl);
    case'mcg-kg-hour':return v.dose*v.kg/(v.bagMcg/v.bagMl);
    case'meq-ml':return v.order/v.conc;
    case'amount-hour':{const perMinute=String(v.orderUnit||'').includes('/min'),hourly=Number(v.order)*(perMinute?60:1);return hourly/(v.bagAmt/v.bagMl)}
    default:return Number(x.answer);
  }};
  E.generate=(key,d='standard')=>{
    const x=previous(key,d);
    if(x?.key==='peds-safe-range'&&Number.isFinite(Number(x.vars?.ml))){
      x.vars.ml=E.finalRound(x.vars.ml);
      return x;
    }
    if(Number.isFinite(Number(x?.answer))&&!wholeNumberUnits.has(x.unit)&&!discreteUnits.has(x.unit)){
      x.answer=E.finalRound(rawAnswer(x));
      x.tolerance=.051;
    }
    return x;
  };
  E.version=5;
})();
