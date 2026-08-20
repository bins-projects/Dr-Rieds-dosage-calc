(() => {
  const typeEl=document.querySelector('#type'),apply=document.querySelector('#apply-vars'),problem=document.querySelector('#problem'),answer=document.querySelector('#answer-panel'),formula=document.querySelector('#formula-panel'),formulaBtn=document.querySelector('#show-formula');
  if(!typeEl||!apply||!problem||!answer)return;
  const value=k=>document.querySelector(`[data-key="${k}"]`)?.value;
  apply.addEventListener('click',e=>{
    if(typeEl.value!=='amount-hour'||String(value('drug')||'').trim().toLowerCase()!=='diltiazem')return;
    e.preventDefault();e.stopImmediatePropagation();
    const order=Number(value('order')),bagAmt=Number(value('bagAmt')),bagMl=Number(value('bagMl'));
    if(!Number.isFinite(order)||!Number.isFinite(bagAmt)||!Number.isFinite(bagMl)||bagAmt<=0||bagMl<=0)return;
    const conc=bagAmt/bagMl,rate=Math.round(((order/conc)+Number.EPSILON)*10)/10;
    problem.textContent=`Diltiazem is ordered as a continuous infusion at ${order} mg/hr. The pharmacy-prepared IV contains ${bagAmt} mg in ${bagMl} mL. What pump rate is required?`;
    answer.innerHTML=`<strong>Answer:</strong> ${rate} mL/hr<br><span>${bagAmt} ÷ ${bagMl} = ${Math.round((conc+Number.EPSILON)*100)/100} mg/mL; ${order} ÷ ${Math.round((conc+Number.EPSILON)*100)/100} = ${rate} mL/hr</span>`;
    answer.hidden=true;
    if(formula){formula.hidden=true;formula.textContent=''}
    if(formulaBtn)formulaBtn.textContent='Show Formula';
  },true);
})();