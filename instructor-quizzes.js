(() => {
  const app=document.querySelector('#app');
  let catalog=[],quiz=null,i=0,score=0,answered=false;
  function parseAnswer(s){const m=s.trim().match(/^(-?\d+(?:\.\d+)?)\s*(.*)$/);if(!m)return null;return{n:+m[1],u:m[2].trim().toLowerCase().replace(/\s+/g,'')}}
  function normUnit(u){return u.replace('ml/hour','ml/hr').replace('mlhr','ml/hr').replace('gtt/minute','gtt/min').replace('gttmin','gtt/min').replace('hrs','hours').replace('hr','hours')}
  function normClock(s){const raw=s.trim().replace(/\s+/g,'');const m=raw.match(/^(\d{1,2}):?(\d{2})$/);if(!m)return null;const h=+m[1],min=+m[2];if(h>23||min>59)return null;return `${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`}
  const safetyLabel=v=>v==='safe'?'Safe':v==='low'?'Too low':'Too high';
  async function loadCatalog(){
    try{const r=await fetch('/api/instructor-quizzes',{cache:'no-store'});if(r.ok){const d=await r.json();catalog=d.quizzes||d;return}}
    catch(_){ }
    try{const r=await fetch('quizzes/index.json',{cache:'no-store'});const d=await r.json();catalog=d.quizzes||[]}
    catch(_){catalog=[]}
  }
  function renderList(){
    if(!catalog.length){app.innerHTML=`<h1 class="title">Instructor Quizzes</h1><p class="copy">There are no published instructor quizzes right now.</p><div class="actions"><a class="text-action" href="index.html">Back home</a></div>`;return}
    app.innerHTML=`<h1 class="title">Instructor Quizzes</h1><p class="subtitle">Choose an assigned quiz.</p><div class="setup">${catalog.map(x=>`<section class="section"><h3>${x.title}</h3><p class="note">${x.questionCount||'?'} questions${x.description?` · ${x.description}`:''}</p><button class="text-action submit" data-quiz="${x.id}">Start quiz</button></section>`).join('')}</div>`;
  }
  async function openQuiz(id){
    app.innerHTML='<h1 class="title">Loading Quiz…</h1>';
    try{
      let data=null;
      try{const r=await fetch(`/api/instructor-quizzes/${encodeURIComponent(id)}`,{cache:'no-store'});if(r.ok)data=await r.json()}catch(_){ }
      if(!data){const entry=catalog.find(x=>x.id===id);const file=entry?.file||`${id}.json`;const r=await fetch(`quizzes/${file}`,{cache:'no-store'});if(!r.ok)throw new Error('Quiz unavailable');data=await r.json()}
      quiz=data;i=0;score=0;renderQuestion();
    }catch(err){app.innerHTML=`<h1 class="title">Quiz Unavailable</h1><p class="copy">This quiz could not be loaded.</p><div class="actions"><button class="text-action" data-a="list">Back</button></div>`}
  }
  function renderQuestion(){
    answered=false;const x=quiz.questions[i];
    let answerUi='';
    if(x.answerMode==='safety'||x.safety){
      answerUi=`<div class="answer-row"><button class="text-action submit" data-safety="safe">Safe</button><button class="text-action submit" data-safety="low">Too low</button><button class="text-action submit" data-safety="high">Too high</button></div>`;
    }else if(x.answerMode==='clock'){
      answerUi=`<div class="answer-row"><input id="answer" class="answer-input" autocomplete="off" placeholder="24-hour time, e.g. 14:30"><button class="text-action submit" data-a="submit">Submit</button></div>`;
    }else{
      answerUi=`<div class="answer-row"><input id="answer" class="answer-input" autocomplete="off" placeholder="Type answer with unit, e.g. 125 mL/hr"><button class="text-action submit" data-a="submit">Submit</button></div>`;
    }
    app.innerHTML=`<div class="meta"><span>${quiz.title} · Question ${i+1} of ${quiz.questions.length}</span><span>${x.type||''}</span></div><div class="problem">${x.prompt}</div>${answerUi}<div id="feedback"></div>`;
    app.querySelector('#answer')?.focus();
  }
  function nextButton(){return `<div class="actions"><button class="text-action submit" data-a="next">${i+1<quiz.questions.length?'Next question':'See results'}</button></div>`}
  function submitSafety(choice){
    if(answered)return;const x=quiz.questions[i],f=app.querySelector('#feedback'),ok=choice===x.safety;
    if(ok&&choice==='safe'&&Number.isFinite(Number(x.amount))){
      f.innerHTML=`<div class="feedback correct"><h3>Safe</h3><p>The order is within the stated recommended range. Now calculate the amount to administer.</p><div class="answer-row"><input id="safety-amount" class="answer-input" autocomplete="off" placeholder="Amount with unit, e.g. 5 mL"><button class="text-action submit" data-a="safety-amount">Submit amount</button></div></div>`;
      app.querySelector('#safety-amount')?.focus();return;
    }
    answered=true;if(ok)score++;
    f.innerHTML=`<div class="feedback ${ok?'correct':'incorrect'}"><h3>${ok?'Correct':'Incorrect'}</h3><p>${ok?safetyLabel(x.safety):`Correct classification: ${safetyLabel(x.safety)}`}</p>${x.solution?`<div class="solution">${x.solution}</div>`:''}${nextButton()}</div>`;
  }
  function submitSafetyAmount(){
    if(answered)return;const x=quiz.questions[i],input=app.querySelector('#safety-amount'),f=app.querySelector('#feedback'),p=parseAnswer(input?.value||'');
    if(!p){f.insertAdjacentHTML('beforeend','<div class="feedback incorrect" data-amount-error>Enter the amount and unit.</div>');return}
    const expectedUnit=(x.amountUnit||'mL').toLowerCase().replace(/\s+/g,''),unitOK=normUnit(p.u)===normUnit(expectedUnit),numOK=Math.abs(p.n-Number(x.amount))<=(x.tolerance??.05),ok=unitOK&&numOK;
    answered=true;if(ok)score++;
    f.innerHTML=`<div class="feedback ${ok?'correct':'incorrect'}"><h3>${ok?'Correct':'Incorrect'}</h3><p>${ok?`${x.amount} ${x.amountUnit||'mL'}`:`Correct amount: ${x.amount} ${x.amountUnit||'mL'}`}</p>${x.solution?`<div class="solution">${x.solution}</div>`:''}${nextButton()}</div>`;
  }
  function submit(){
    if(answered)return;const x=quiz.questions[i],f=app.querySelector('#feedback'),raw=app.querySelector('#answer')?.value||'';
    if(x.answerMode==='clock'){
      const actual=normClock(raw),expected=normClock(String(x.answer));if(!actual){f.innerHTML='<div class="feedback incorrect">Enter a valid 24-hour time.</div>';return}const ok=actual===expected;answered=true;if(ok)score++;f.innerHTML=`<div class="feedback ${ok?'correct':'incorrect'}"><h3>${ok?'Correct':'Incorrect'}</h3><p>${ok?expected:`Correct answer: ${expected}`}</p>${x.solution?`<div class="solution">${x.solution}</div>`:''}${nextButton()}</div>`;return;
    }
    const p=parseAnswer(raw);if(!p){f.innerHTML='<div class="feedback incorrect">Enter a number and the unit.</div>';return}
    const unitOK=normUnit(p.u)===normUnit((x.unit||'').toLowerCase().replace(/\s+/g,''));
    const numOK=Math.abs(p.n-x.answer)<=(x.tolerance??.05);const ok=unitOK&&numOK;answered=true;if(ok)score++;
    f.innerHTML=`<div class="feedback ${ok?'correct':'incorrect'}"><h3>${ok?'Correct':'Incorrect'}</h3><p>${ok?`${x.answer} ${x.unit}`:`Correct answer: ${x.answer} ${x.unit}`}</p>${x.solution?`<div class="solution">${x.solution}</div>`:''}${nextButton()}</div>`;
  }
  function next(){i++;if(i>=quiz.questions.length)return results();renderQuestion()}
  function results(){const pct=Math.round(score/quiz.questions.length*100);app.innerHTML=`<div class="results"><h1 class="title">Quiz Complete</h1><p class="subtitle">${quiz.title}</p><div class="score">${score}/${quiz.questions.length}</div><p class="subtitle">${pct}%</p><div class="actions" style="justify-content:center"><button class="text-action" data-a="list">Instructor Quizzes</button><a class="text-action" href="index.html">Home</a></div></div>`}
  app.addEventListener('click',e=>{const q=e.target.closest('[data-quiz]');if(q){openQuiz(q.dataset.quiz);return}const s=e.target.closest('[data-safety]');if(s){submitSafety(s.dataset.safety);return}const b=e.target.closest('[data-a]');if(!b)return;if(b.dataset.a==='submit')submit();if(b.dataset.a==='safety-amount')submitSafetyAmount();if(b.dataset.a==='next')next();if(b.dataset.a==='list')renderList()});
  app.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='answer'){e.preventDefault();submit()}if(e.key==='Enter'&&e.target.id==='safety-amount'){e.preventDefault();submitSafetyAmount()}});
  loadCatalog().then(()=>{const id=new URLSearchParams(location.search).get('quiz');id?openQuiz(id):renderList()});
})();
