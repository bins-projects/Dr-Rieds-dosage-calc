(() => {
  const app=document.querySelector('#app');
  if(!app)return;

  const groups=[
    ['Medication Doses',['basic-dose','reconstitution','meq-ml']],
    ['Pediatric & Weight-Based',['weight-dose','peds-weight-liquid','daily-divided']],
    ['IV Rates & Timing',['mlhr-hours','mlhr-minutes','infusion-time','completion-time','gtt-volume-time','gtt-from-mlhr','mlhr-from-gtt']],
    ['Critical-Care Infusions',['units-hour','mcg-minute','mcg-kg-minute','amount-hour']]
  ];

  function organize(){
    const grid=app.querySelector('.type-grid');
    if(!grid||grid.dataset.grouped==='true')return;
    const labels=[...grid.querySelectorAll('label.choice')];
    if(!labels.length)return;
    const byId=new Map(labels.map(label=>[label.querySelector('input[name="type"]')?.value,label]));
    const wrapper=document.createElement('div');
    wrapper.className='type-groups';
    groups.forEach(([title,ids])=>{
      const section=document.createElement('section');
      section.className='type-group';
      const heading=document.createElement('h4');
      heading.textContent=title;
      section.appendChild(heading);
      const choices=document.createElement('div');
      choices.className='type-group-grid';
      ids.forEach(id=>{const label=byId.get(id);if(label)choices.appendChild(label)});
      section.appendChild(choices);
      wrapper.appendChild(section);
    });
    labels.forEach(label=>{if(label.isConnected)wrapper.lastElementChild.querySelector('.type-group-grid').appendChild(label)});
    grid.replaceWith(wrapper);
    wrapper.dataset.grouped='true';
  }

  const observer=new MutationObserver(organize);
  observer.observe(app,{childList:true,subtree:true});
  organize();
})();
