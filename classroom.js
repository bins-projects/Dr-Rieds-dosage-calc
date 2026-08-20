(() => {
  const E=window.DosageEngine;if(!E)throw new Error('DosageEngine not loaded');if(typeof E.rebuild!=='function')throw new Error('DosageEngine rebuild helper not loaded');
  const typeEl=document.querySelector('#type'),difficultyEl=document.querySelector('#difficulty'),varsEl=document.querySelector('#variables'),problemEl=document.querySelector('#problem'),answerEl=document.querySelector('#answer-panel'),labelEl=document.querySelector('#type-label'),formulaEl=document.querySelector('#formula-panel'),formulaBtn=document.querySelector('#show-formula');
  let current=null;
  E.types.forEach(t=>typeEl.add(new Option(t.label,t.key)));
  const labels={drug:'Medication',context:'Clinical context',order:'Ordered dose/rate',have:'Available dose/concentration',qty:'Available quantity (mL or units)',unit:'Quantity unit',route:'Route/frequency',kg:'Weight (kg)',dose:'Dose per kg',freq:'Frequency',doses:'Doses per day',minDay:'Minimum mg/kg/day',maxDay:'Maximum mg/kg/day',volume:'Volume (mL)',hours:'Time (hours)',minutes:'Time (minutes)',fluid:'IV fluid',rate:'Rate (mL/hr)',start:'Start time (24-hour)',v:'Volume (mL)',r:'Rate (mL/hr)',dropFactor:'Drop factor (gtt/mL)',dropsPerMinute:'Flow (gtt/min)',conc:'Concentration',bagUnits:'Bag total units',bagMl:'Bag volume (mL)',bagMcg:'Bag total mcg',bagAmt:'Bag total amount',orderUnit:'Order unit',kind:'Scenario type',daily:'Daily dose (mg/kg/day)'};
  const editableSkip=new Set(['min','max','ml','safety']);
  const pretty=k=>labels[k]||k.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase());
  function renderFields(vars){varsEl.innerHTML='';Object.entries(vars||{}).filter(([k])=>!editableSkip.has(k)).forEach(([k,v])=>{const lab=document.createElement('label');lab.textContent=pretty(k);const input=document.createElement('input');input.dataset.key=k;input.value=v;input.type=typeof v==='number'?'number':'text';if(typeof v==='number')input.step='any';lab.appendChild(input);varsEl.appendChild(lab)})}
  function readVars(){const out={...(current?.vars||{})};varsEl.querySelectorAll('[data-key]').forEach(input=>{out[input.dataset.key]=input.type==='number'?Number(input.value):input.value});return out}
  function hidePanels(){answerEl.hidden=true;formulaEl.hidden=true;formulaEl.textContent='';formulaBtn.textContent='Show Formula'}
  function solutionMarkup(q){return `<strong>Answer:</strong> ${q.answer}${q.unit?` ${q.unit}`:''}<div class="formula-help"><strong>Formula:</strong> ${q.formula||''}</div><div class="solution"><strong>Worked equation:</strong><br>${String(q.solution||'').replace(/\n/g,'<br>')}</div>`}
  function show(q,refreshFields=true){current=q;labelEl.textContent=q.type;problemEl.textContent=q.prompt;answerEl.innerHTML=solutionMarkup(q);hidePanels();if(refreshFields)renderFields(q.vars||{})}
  function randomQuestion(){show(E.generate(typeEl.value,difficultyEl.value),true)}
  function applyVars(){show(E.rebuild(typeEl.value,readVars(),current),true)}
  typeEl.addEventListener('change',randomQuestion);
  difficultyEl.addEventListener('change',randomQuestion);
  document.querySelector('#new-question').addEventListener('click',randomQuestion);
  document.querySelector('#apply-vars').addEventListener('click',applyVars);
  document.querySelector('#reveal').addEventListener('click',()=>{answerEl.hidden=!answerEl.hidden});
  formulaBtn.addEventListener('click',()=>{if(formulaEl.hidden){formulaEl.innerHTML=`<strong>Formula:</strong> ${current?.formula||''}`;formulaEl.hidden=false;formulaBtn.textContent='Hide Formula'}else{formulaEl.hidden=true;formulaBtn.textContent='Show Formula'}});
  randomQuestion();
})();