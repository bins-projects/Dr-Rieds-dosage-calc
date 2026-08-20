(() => {
  const button = document.querySelector('#project-question');
  if (!button) return;

  const esc = (s = '') => String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

  function getQuestions() {
    return [...document.querySelectorAll('#question-list .question-row')].map((row, index) => {
      const prompt = row.querySelector('p')?.textContent?.trim() || 'Question unavailable';
      const answerBox = row.querySelector('.answer');
      const answer = answerBox
        ? [...answerBox.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim()
        : '';
      const detailPs = [...row.querySelectorAll('details p')];
      const formula = detailPs[0]?.textContent?.trim() || '';
      const equation = detailPs[1]?.textContent?.trim() || '';
      return { number: index + 1, prompt, answer, formula, equation };
    });
  }

  button.addEventListener('click', () => {
    const questions = getQuestions();
    if (!questions.length) {
      alert('Generate a draft first.');
      return;
    }

    const title = document.querySelector('#review-title')?.textContent?.trim() || 'Dosage Question';
    const w = window.open('', '_blank');
    if (!w) {
      alert('Your browser blocked the projector window. Allow pop-ups for this site and try again.');
      return;
    }

    const payload = JSON.stringify(questions).replaceAll('<', '\\u003c');
    w.document.open();
    w.document.write(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · Projector</title>
<style>
*{box-sizing:border-box}html,body{margin:0;min-height:100%;background:#15172b;font-family:"Segoe Print","Bradley Hand","Comic Sans MS",cursive;color:#1f2f43}body{min-height:100vh;display:grid;place-items:center}.stage{position:relative;width:min(100vw,calc(100vh * 16 / 9));aspect-ratio:16/9;background:url("assets/dosage-lab-classroom.png?v=20260819-1") center/contain no-repeat;overflow:hidden}.board{position:absolute;left:17.2%;top:14.2%;width:55.4%;height:63.5%;padding:clamp(18px,2vw,38px);overflow:auto}.eyebrow{font:700 clamp(13px,1.1vw,18px)/1 Georgia,"Times New Roman",serif;color:#566273;margin:0 0 14px}.problem{font-size:clamp(23px,2.05vw,37px);line-height:1.3;margin:0;color:#1f2f43}.controls{margin-top:22px;display:flex;gap:16px;flex-wrap:wrap;align-items:center}.btn{appearance:none;border:0;background:transparent;color:#244f83;text-decoration:underline;text-underline-offset:4px;font:700 clamp(17px,1.3vw,23px)/1.2 "Segoe Print","Bradley Hand","Comic Sans MS",cursive;cursor:pointer}.btn:disabled{opacity:.35;cursor:default}.counter{margin-left:auto;font:700 clamp(13px,1vw,17px)/1 Georgia,"Times New Roman",serif;color:#566273}.answer{margin-top:18px;padding-top:16px;border-top:2px solid rgba(49,67,89,.2);font-size:clamp(19px,1.55vw,28px);line-height:1.35}.answer strong{color:#21623a}.math-card{margin-top:12px;padding:12px 14px;border-left:4px solid rgba(36,79,131,.35);background:rgba(255,255,255,.34);font-family:Georgia,"Times New Roman",serif;color:#334153}.math-label{font-weight:700;color:#244f83;margin-bottom:4px}.formula{font-size:clamp(15px,1.05vw,19px);line-height:1.4}.equation{margin-top:9px;font-size:clamp(16px,1.15vw,21px);line-height:1.45;white-space:pre-line}.home{position:absolute;left:1.2%;top:1.4%;color:#fff;background:rgba(20,25,45,.72);padding:7px 10px;border-radius:7px;text-decoration:none;font:700 14px Arial,sans-serif}@media(max-aspect-ratio:1/1){body{display:block}.stage{width:100vw;margin-top:max(0px,calc((100vh - 56.25vw)/2))}.problem{font-size:clamp(18px,4vw,30px)}}
</style>
</head>
<body>
<main class="stage">
<a class="home" href="javascript:window.close()">← Close</a>
<section class="board">
<p id="eyebrow" class="eyebrow"></p>
<div id="problem" class="problem"></div>
<div class="controls">
  <button id="prev" class="btn">← Previous</button>
  <button id="reveal" class="btn">Reveal Solution</button>
  <button id="next" class="btn">Next →</button>
  <span id="counter" class="counter"></span>
</div>
<div id="answer" class="answer" hidden>
  <strong id="answer-value"></strong>
  <div class="math-card">
    <div class="math-label">Formula</div><div id="formula" class="formula"></div>
    <div class="math-label" style="margin-top:10px">Worked equation</div><div id="equation" class="equation"></div>
  </div>
</div>
</section>
</main>
<script>
const questions=${payload};let i=0;
const el=id=>document.getElementById(id);
function render(){const q=questions[i];el('eyebrow').textContent=${JSON.stringify(title)}+' · Question '+(i+1)+' of '+questions.length;el('problem').textContent=q.prompt;el('answer-value').textContent=q.answer;el('formula').textContent=q.formula||'Formula unavailable';el('equation').textContent=q.equation||'Worked equation unavailable';el('answer').hidden=true;el('reveal').textContent='Reveal Solution';el('prev').disabled=i===0;el('next').disabled=i===questions.length-1;el('counter').textContent=(i+1)+' / '+questions.length;}
el('reveal').addEventListener('click',()=>{const a=el('answer');a.hidden=!a.hidden;el('reveal').textContent=a.hidden?'Reveal Solution':'Hide Solution'});
el('prev').addEventListener('click',()=>{if(i>0){i--;render()}});
el('next').addEventListener('click',()=>{if(i<questions.length-1){i++;render()}});
document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'&&i>0){i--;render()}if(e.key==='ArrowRight'&&i<questions.length-1){i++;render()}if(e.key===' '){e.preventDefault();el('reveal').click()}});
render();
<\/script>
</body>
</html>`);
    w.document.close();
  });
})();
