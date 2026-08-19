(() => {
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const shuffle=a=>{a=[...a];for(let j=a.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[a[j],a[k]]=[a[k],a[j]]}return a};
  const round=(n,p=1)=>{const f=10**p;return Math.round((n+Number.EPSILON)*f)/f};
  const q=(type,prompt,answer,unit,formula,note,solution,tolerance=.05)=>({type,prompt,answer,unit,formula,note,solution,tolerance});

  function mlhr(){const[v,h]=pick([[1000,8],[1000,10],[500,4],[500,5],[250,2],[150,1.5],[100,.5],[250,2.5],[1000,12],[500,8]]);const a=round(v/h,1);return q('mL/hr',`Infuse ${v.toLocaleString()} mL over ${h} ${h===1?'hour':'hours'}. What rate should the IV pump be programmed to?`,a,'mL/hr','mL ÷ hours = mL/hr','Divide total volume by infusion time.',`${v.toLocaleString()} mL ÷ ${h} hr = ${a} mL/hr`)}
  function mlhrMin(){const[v,m]=pick([[100,30],[250,90],[500,150],[150,45],[50,30],[100,45],[250,120],[75,30]]);const h=m/60,a=round(v/h,1);return q('Minutes → mL/hr',`Infuse ${v} mL over ${m} minutes. What rate should the IV pump be programmed to?`,a,'mL/hr','mL ÷ (minutes ÷ 60) = mL/hr','Convert minutes to hours first.',`${m} min ÷ 60 = ${round(h,2)} hr\n${v} mL ÷ ${round(h,2)} hr = ${a} mL/hr`)}
  function gtt(){const[v,h,d]=pick([[1000,8,15],[500,4,20],[1000,10,10],[250,2,15],[500,6,20],[1000,12,15],[250,4,10],[120,2,60]]);const m=h*60,r=v*d/m,a=Math.round(r);return q('gtt/min',`Infuse ${v.toLocaleString()} mL over ${h} hours. Tubing drop factor is ${d} gtt/mL. Calculate the flow rate.`,a,'gtt/min','(mL × gtt/mL) ÷ minutes = gtt/min','Convert hours to minutes; round final answer to a whole drop.',`${h} hr × 60 = ${m} min\n(${v} × ${d}) ÷ ${m} = ${round(r,2)}\nRound = ${a} gtt/min`)}
  function gttFromMlhr(){const[r,d]=pick([[100,15],[125,20],[150,10],[75,20],[80,15],[120,10],[60,60],[125,15]]);const x=r*d/60,a=Math.round(x);return q('mL/hr → gtt/min',`An IV is infusing at ${r} mL/hr with tubing ${d} gtt/mL. What gravity flow rate should be set?`,a,'gtt/min','(mL/hr × gtt/mL) ÷ 60 = gtt/min','Convert the hourly rate to drops per minute.',`(${r} × ${d}) ÷ 60 = ${round(x,2)}\nRound = ${a} gtt/min`)}
  function mlhrFromGtt(){const[g,d]=pick([[25,15],[42,20],[20,10],[60,60],[30,15],[40,20],[15,10],[50,20]]);const a=round(g*60/d,1);return q('gtt/min → mL/hr',`An IV is running at ${g} gtt/min using tubing ${d} gtt/mL. What is the equivalent infusion rate?`,a,'mL/hr','(gtt/min × 60) ÷ gtt/mL = mL/hr','Convert drops per minute to drops per hour, then divide by the drop factor.',`(${g} × 60) ÷ ${d} = ${a} mL/hr`)}
  function duration(){const[v,r]=pick([[1000,125],[500,100],[250,125],[1000,100],[500,125],[250,100],[100,200],[500,80]]);const a=round(v/r,2);return q('Infusion duration',`${v.toLocaleString()} mL is infusing at ${r} mL/hr. How many hours will the infusion take?`,a,'hours','mL ÷ mL/hr = hours','Divide volume by hourly rate.',`${v.toLocaleString()} mL ÷ ${r} mL/hr = ${a} hours`,.02)}

  const types=[
    ['mlhr-hours','mL/hr — hours',mlhr],
    ['mlhr-minutes','mL/hr — minutes',mlhrMin],
    ['gtt-volume-time','gtt/min — volume + time',gtt],
    ['gtt-from-mlhr','mL/hr → gtt/min',gttFromMlhr],
    ['mlhr-from-gtt','gtt/min → mL/hr',mlhrFromGtt],
    ['infusion-time','Infusion duration',duration]
  ];

  const typeList=document.querySelector('#type-list');
  const titleInput=document.querySelector('#quiz-title');
  const review=document.querySelector('#review');
  const questionList=document.querySelector('#question-list');
  const status=document.querySelector('#status');
  const publishStatus=document.querySelector('#publish-status');
  const approved=document.querySelector('#approved');
  const publish=document.querySelector('#publish');
  let draft=null;

  typeList.innerHTML=types.map((t,i)=>`<label><input type="checkbox" name="type" value="${t[0]}" ${i===0?'checked':''}> ${t[1]}</label>`).join('');

  function selectedTypes(){return [...document.querySelectorAll('input[name="type"]:checked')].map(x=>x.value)}
  function questionCount(){return +(document.querySelector('input[name="count"]:checked')?.value||20)}
  function slug(s){return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||`quiz-${Date.now()}`}
  function buildQuestion(keys,index){const available=types.filter(t=>keys.includes(t[0]));const t=available[index%available.length];return t[2]();}
  function buildDraft(){
    const keys=selectedTypes();
    if(!keys.length){status.textContent='Choose at least one question type.';return}
    const count=questionCount();
    const ordered=shuffle(keys);
    const questions=[];
    for(let i=0;i<count;i++) questions.push(buildQuestion(ordered,i));
    const title=titleInput.value.trim()||'Instructor Quiz';
    draft={version:1,id:slug(title),title,status:'draft',createdAt:new Date().toISOString(),questionCount:questions.length,questionTypes:[...new Set(keys)],questions};
    approved.checked=false; publish.disabled=true; publishStatus.textContent=''; status.textContent=`Draft created with ${questions.length} frozen questions.`;
    renderReview();
  }
  function renderReview(){
    if(!draft)return;
    review.hidden=false;
    document.querySelector('#review-title').textContent=draft.title;
    questionList.innerHTML=draft.questions.map((x,idx)=>`<article class="question-row"><div class="qnum">${idx+1}</div><div><p>${x.prompt}</p><div class="answer">${x.answer} ${x.unit}<span class="badge">${x.type}</span></div></div><button class="secondary replace" data-replace="${idx}">Replace</button></article>`).join('');
  }
  function replaceOne(index){
    const keys=draft.questionTypes;
    draft.questions[index]=buildQuestion(keys,index);
    approved.checked=false; publish.disabled=true; publishStatus.textContent='Question replaced. Review approval reset.';
    renderReview();
  }
  async function publishDraft(){
    if(!draft||!approved.checked)return;
    draft.status='published'; draft.publishedAt=new Date().toISOString();
    publish.disabled=true; publishStatus.textContent='Publishing…';
    try{
      const res=await fetch('/api/instructor-quizzes',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(draft)});
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data=await res.json();
      publishStatus.textContent=`Published. Students can now open “${draft.title}”.`;
      if(data.id) draft.id=data.id;
    }catch(err){
      draft.status='approved';
      const blob=new Blob([JSON.stringify(draft,null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`${draft.id}.json`; a.click(); URL.revokeObjectURL(url);
      publishStatus.textContent='Cloudflare publish endpoint is not connected yet, so the approved quiz JSON was downloaded instead.';
      publish.disabled=false;
    }
  }

  document.querySelector('#generate').addEventListener('click',buildDraft);
  document.querySelector('#regenerate').addEventListener('click',buildDraft);
  document.querySelector('#clear').addEventListener('click',()=>{draft=null;review.hidden=true;status.textContent='';publishStatus.textContent=''});
  questionList.addEventListener('click',e=>{const b=e.target.closest('[data-replace]');if(b)replaceOne(+b.dataset.replace)});
  approved.addEventListener('change',()=>{publish.disabled=!approved.checked});
  publish.addEventListener('click',publishDraft);
})();
