(() => {
  const app=document.querySelector('#app');
  let catalog=[],quiz=null,i=0,score=0,answered=false;
  function parseAnswer(s){const m=s.trim().match(/^(-?\d+(?:\.\d+)?)\s*(.*)$/);if(!m)return null;return{n:+m[1],u:m[2].trim().toLowerCase().replace(/\s+/g,'')}}
  function normUnit(u){return u.replace('ml/hour','ml/hr').replace('mlhr','ml/hr').replace('gtt/minute','gtt/min').replace('gttmin','gtt/min').replace('hrs','hours').replace('hr','hours')}
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
    app.innerHTML=`<div class="meta"><span>${quiz.title} · Question ${i+1} of ${quiz.questions.length}</span><span>${x.type||''}</span></div><div class="problem">${x.prompt}</div><div class="answer-row"><input id="answer" class="answer-input" autocomplete="off" placeholder="Type answer with unit, e.g. 125 mL/hr"><button class="text-action submit" data-a="submit">Submit</button></div><div id="feedback"></div>`;
    app.querySelector('#answer').focus();
  }
  function submit(){
    if(answered)return;const x=quiz.questions[i],p=parseAnswer(app.querySelector('#answer').value),f=app.querySelector('#feedback');
    if(!p){f.innerHTML='<div class="feedback incorrect">Enter a number and the unit.</div>';return}
    const unitOK=normUnit(p.u)===normUnit((x.unit||'').toLowerCase().replace(/\s+/g,''));
    const numOK=Math.abs(p.n-x.answer)<=(x.tolerance??.05);const ok=unitOK&&numOK;answered=true;if(ok)score++;
    f.innerHTML=`<div class="feedback ${ok?'correct':'incorrect'}"><h3>${ok?'Correct':'Incorrect'}</h3><p>${ok?`${x.answer} ${x.unit}`:`Correct answer: ${x.answer} ${x.unit}`}</p><div class="actions"><button class="text-action submit" data-a="next">${i+1<quiz.questions.length?'Next question':'See results'}</button></div></div>`;
  }
  function next(){i++;if(i>=quiz.questions.length)return results();renderQuestion()}
  function results(){const pct=Math.round(score/quiz.questions.length*100);app.innerHTML=`<div class="results"><h1 class="title">Quiz Complete</h1><p class="subtitle">${quiz.title}</p><div class="score">${score}/${quiz.questions.length}</div><p class="subtitle">${pct}%</p><div class="actions" style="justify-content:center"><button class="text-action" data-a="list">Instructor Quizzes</button><a class="text-action" href="index.html">Home</a></div></div>`}
  app.addEventListener('click',e=>{const q=e.target.closest('[data-quiz]');if(q){openQuiz(q.dataset.quiz);return}const b=e.target.closest('[data-a]');if(!b)return;if(b.dataset.a==='submit')submit();if(b.dataset.a==='next')next();if(b.dataset.a==='list')renderList()});
  app.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='answer'){e.preventDefault();submit()}});
  loadCatalog().then(()=>{const id=new URLSearchParams(location.search).get('quiz');id?openQuiz(id):renderList()});
})();
