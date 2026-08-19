(() => {
  const button = document.querySelector('#project-question');
  if (!button) return;

  const esc = (s = '') => String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

  button.addEventListener('click', () => {
    const row = document.querySelector('#question-list .question-row');
    if (!row) {
      alert('Generate a draft first. For a single projector question, choose 1 question before generating.');
      return;
    }

    const prompt = row.querySelector('p')?.textContent?.trim() || 'Question unavailable';
    const answerBox = row.querySelector('.answer');
    const answer = answerBox ? [...answerBox.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim() : '';
    const solution = row.querySelector('details p')?.textContent?.trim() || '';
    const title = document.querySelector('#review-title')?.textContent?.trim() || 'Dosage Question';

    const w = window.open('', '_blank');
    if (!w) {
      alert('Your browser blocked the projector window. Allow pop-ups for this site and try again.');
      return;
    }

    w.document.open();
    w.document.write(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · Projector</title>
<style>
*{box-sizing:border-box}html,body{margin:0;min-height:100%;background:#15172b;font-family:"Segoe Print","Bradley Hand","Comic Sans MS",cursive;color:#1f2f43}body{min-height:100vh;display:grid;place-items:center}.stage{position:relative;width:min(100vw,calc(100vh * 16 / 9));aspect-ratio:16/9;background:url("assets/dosage-lab-classroom.png?v=20260819-1") center/contain no-repeat;overflow:hidden}.board{position:absolute;left:17.2%;top:14.2%;width:55.4%;height:63.5%;padding:clamp(18px,2vw,38px);overflow:auto}.eyebrow{font:700 clamp(13px,1.1vw,18px)/1 Georgia,"Times New Roman",serif;color:#566273;margin:0 0 14px}.problem{font-size:clamp(24px,2.25vw,40px);line-height:1.32;margin:0;color:#1f2f43}.controls{margin-top:24px;display:flex;gap:18px;flex-wrap:wrap}.btn{appearance:none;border:0;background:transparent;color:#244f83;text-decoration:underline;text-underline-offset:4px;font:700 clamp(18px,1.4vw,25px)/1.2 "Segoe Print","Bradley Hand","Comic Sans MS",cursive;cursor:pointer}.answer{margin-top:20px;padding-top:18px;border-top:2px solid rgba(49,67,89,.2);font-size:clamp(20px,1.7vw,30px);line-height:1.35}.answer strong{color:#21623a}.solution{margin-top:10px;font-family:Georgia,"Times New Roman",serif;font-size:clamp(15px,1.05vw,19px);line-height:1.45;white-space:pre-line;color:#334153}.home{position:absolute;left:1.2%;top:1.4%;color:#fff;background:rgba(20,25,45,.72);padding:7px 10px;border-radius:7px;text-decoration:none;font:700 14px Arial,sans-serif}@media(max-aspect-ratio:1/1){body{display:block}.stage{width:100vw;margin-top:max(0px,calc((100vh - 56.25vw)/2))}.problem{font-size:clamp(18px,4vw,30px)}}
</style>
</head>
<body>
<main class="stage">
<a class="home" href="javascript:window.close()">← Close</a>
<section class="board">
<p class="eyebrow">${esc(title)} · Classroom Question</p>
<div class="problem">${esc(prompt)}</div>
<div class="controls"><button id="reveal" class="btn">Reveal Answer</button></div>
<div id="answer" class="answer" hidden><strong>${esc(answer)}</strong>${solution ? `<div class="solution">${esc(solution)}</div>` : ''}</div>
</section>
</main>
<script>document.querySelector('#reveal').addEventListener('click',()=>{const a=document.querySelector('#answer');a.hidden=!a.hidden;document.querySelector('#reveal').textContent=a.hidden?'Reveal Answer':'Hide Answer'});<\/script>
</body>
</html>`);
    w.document.close();
  });
})();
