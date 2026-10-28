'use strict';
(() => {
  const DATA = window.STUDIO;
  const $ = (id) => document.getElementById(id);
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const STORAGE_KEY = 'speaking-studio-v1';
  let storageAvailable = true;
  let saved;
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { storageAvailable = false; saved = {}; }
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) saved = {};
  const state = {
    theme: DATA.themes.some(t => t.id === saved.theme) ? saved.theme : 'home',
    part: DATA.parts.some(p => p.id === saved.part) ? saved.part : 'p1',
    indices: saved.indices && typeof saved.indices === 'object' && !Array.isArray(saved.indices) ? saved.indices : {},
    tasks: saved.tasks && typeof saved.tasks === 'object' && !Array.isArray(saved.tasks) ? saved.tasks : {},
    resource: 'words'
  };
  let toastTimeout;
  let timer = { duration:240, remaining:240, deadline:null, running:false, preset:0 };
  const theme = () => DATA.themes.find(t => t.id === state.theme);
  const part = () => DATA.parts.find(p => p.id === state.part);
  const questionCount = () => state.part === 'p2' ? 1 : theme()[state.part].length;
  const indexKey = () => `${state.theme}-${state.part}`;
  const questionIndex = () => {
    const n = state.indices[indexKey()];
    return Number.isInteger(n) && n >= 0 && n < questionCount() ? n : 0;
  };
  const taskKey = () => `${indexKey()}-${questionIndex()}`;
  function taskData(key = taskKey()) {
    let task = state.tasks[key];
    if (!task || typeof task !== 'object' || Array.isArray(task)) task = {};
    const result = {
      notes: typeof task.notes === 'string' ? task.notes.slice(0,15000) : '',
      next: typeof task.next === 'string' ? task.next.slice(0,2000) : '',
      checks: Array.from({length:5}, (_,i) => Array.isArray(task.checks) && task.checks[i] === true),
      done: task.done === true
    };
    state.tasks[key] = result;
    return result;
  }
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({theme:state.theme,part:state.part,indices:state.indices,tasks:state.tasks}));
      storageAvailable = true;
    } catch { storageAvailable = false; }
    $('save-status').textContent = storageAvailable ? 'Saved on this device' : 'Not saved · export a copy';
    $('save-status').style.color = storageAvailable ? '' : '#ab633d';
  }
  function toast(message) {
    clearTimeout(toastTimeout);
    $('toast').textContent = message;
    $('toast').classList.add('visible');
    toastTimeout = setTimeout(() => $('toast').classList.remove('visible'), 3500);
  }
  function completedInPart(id) {
    const total = id === 'p2' ? 1 : theme()[id].length;
    let completed = 0;
    for (let i=0;i<total;i++) if (taskData(`${state.theme}-${id}-${i}`).done) completed++;
    return [completed,total];
  }
  function renderNav() {
    $('part-nav').innerHTML = DATA.parts.map((p,i) => {
      const [done,total] = completedInPart(p.id);
      return `<button class="part-link ${p.id === state.part ? 'active' : ''}" data-part="${p.id}" aria-label="Part ${i+1}: ${p.short}. ${done} of ${total} practised" ${p.id === state.part ? 'aria-current="step"' : ''}><span class="part-number">0${i+1}</span><span><strong>${p.short}</strong><small>${p.duration} · ${done}/${total} practised</small></span><span class="nav-arrow" aria-hidden="true">›</span></button>`;
    }).join('');
  }
  function renderTask() {
    const t = theme();
    const p = part();
    const i = questionIndex();
    const count = questionCount();
    $('task-label').textContent = state.part === 'p2' ? 'YOUR CUE CARD' : state.part === 'p1' ? 'LET’S START A CONVERSATION' : 'LET’S EXPLORE THE IDEA';
    $('task-count').textContent = state.part === 'p2' ? '1 min prep · up to 2 min talk' : `${String(i+1).padStart(2,'0')} / ${String(count).padStart(2,'0')}`;
    if (state.part === 'p2') {
      const cue = t.p2;
      $('task-content').innerHTML = `<h3 id="task-title" tabindex="-1">${escape(cue.title)}</h3><p class="cue-lead">You should say:</p><ul class="cue-bullets">${cue.bullets.map(b=>`<li>${escape(b)}</li>`).join('')}</ul><p class="cue-end">${escape(cue.end)}</p><details class="followups"><summary>Finish with a brief follow-up</summary><ul>${cue.followups.map(q=>`<li>${escape(q)}</li>`).join('')}</ul></details>`;
      $('question-navigation').innerHTML = '';
    } else {
      const question = t[state.part][i];
      $('task-content').innerHTML = `<div class="task-topic">${escape(question[0])}</div><h3 id="task-title" tabindex="-1">${escape(question[1])}</h3><p class="task-tip"><strong>A way in:</strong> ${escape(question[2])}</p>`;
      $('question-navigation').innerHTML = `<div class="question-navigation"><div class="question-dots" aria-label="Choose a question">${t[state.part].map((q,j)=>`<button class="question-dot ${j===i?'active':''} ${taskData(`${indexKey()}-${j}`).done?'done':''}" data-question="${j}" aria-label="Question ${j+1}${taskData(`${indexKey()}-${j}`).done?', practised':''}" ${j===i?'aria-current="true"':''}>${j+1}</button>`).join('')}</div><div class="question-arrows"><button class="icon-button" id="previous-question" aria-label="Previous question" ${i===0?'disabled':''}>←</button><button class="icon-button" id="next-question" aria-label="Next question" ${i===count-1?'disabled':''}>→</button></div></div><details class="all-questions"><summary>See all ${count} questions in this set</summary><ol>${t[state.part].map((q,j)=>`<li><button data-question="${j}">${escape(q[1])}</button></li>`).join('')}</ol></details>`;
    }
    const task = taskData();
    $('student-notes').value = task.notes;
    $('next-step').value = task.next;
    $('practice-help').textContent = p.help;
    updateWordCount();
    renderChecklist();
    const partPosition = DATA.parts.findIndex(x => x.id === state.part);
    const next = DATA.parts[partPosition+1];
    $('next-part').innerHTML = next ? `<button class="text-button" data-part="${next.id}">Continue to Part ${partPosition+2} · ${escape(next.short)} <span aria-hidden="true">→</span></button>` : `<button class="text-button" id="new-theme-button">Try another theme <span aria-hidden="true">→</span></button>`;
  }
  function renderChecklist() {
    const task = taskData();
    $('checklist').innerHTML = DATA.checks[state.part].map((c,i) => `<label class="check-item"><input type="checkbox" data-check="${i}" ${task.checks[i]?'checked':''}><span><strong>${escape(c[0])}</strong><small>${escape(c[1])}</small></span></label>`).join('');
    const checked = task.checks.filter(Boolean).length;
    $('checklist-count').textContent = `${checked} / 5`;
    $('completion-caption').textContent = task.done ? 'Practice logged. Come back any time.' : 'Reflect on what you noticed.';
    $('complete-button').classList.toggle('complete',task.done);
    $('complete-button').innerHTML = task.done ? 'Practised <span aria-hidden="true">✓</span>' : 'Mark as practised <span aria-hidden="true">→</span>';
    $('complete-button').setAttribute('aria-pressed',String(task.done));
  }
  function renderResources() {
    const isWords = state.resource === 'words';
    ['words','phrases'].forEach(name => {
      $(name+'-tab').setAttribute('aria-selected',String(name === state.resource));
      $(name+'-tab').tabIndex = name === state.resource ? 0 : -1;
    });
    $('resource-content').setAttribute('aria-labelledby', state.resource+'-tab');
    if (isWords) {
      $('resource-content').innerHTML = `<p class="resource-intro">${escape(theme().name)} · Part ${state.part.slice(1)}<br>Open a word to see its meaning and an example.</p>${theme().words[state.part].map((w,i)=>`<details class="word-item"><summary>${escape(w[0])}</summary><div class="word-detail"><p>${escape(w[1])}</p><p class="word-example">“${escape(w[2])}”</p><button class="text-button" data-add-word="${i}">Add to my notes <span aria-hidden="true">＋</span></button></div></details>`).join('')}`;
    } else {
      const phrases = [...DATA.phrases[state.part],['Connect to this theme',theme().starter[state.part]]];
      $('resource-content').innerHTML = `<p class="resource-intro">Try a phrase, then complete it with your own idea.</p>${phrases.map((p,i)=>`<div class="phrase-item"><div class="phrase-label">${escape(p[0])}</div><p class="phrase-text">${escape(p[1])}</p><button class="text-button" data-add-phrase="${i}">Add to my notes <span aria-hidden="true">＋</span></button></div>`).join('')}`;
    }
  }
  function render() {
    const p = part();
    $('theme-name').textContent = theme().name;
    $('theme-button').setAttribute('aria-label',`Change theme. Current theme: ${theme().name}`);
    $('breadcrumb-part').textContent = 'Part '+state.part.slice(1);
    $('part-kicker').textContent = p.kicker;
    $('part-heading').textContent = p.name;
    $('part-description').textContent = p.description;
    $('part-duration').textContent = p.duration;
    $('studio-tip-title').textContent = p.tipTitle;
    $('studio-tip').textContent = p.tip;
    document.title = `${theme().name} · Part ${state.part.slice(1)} | Speaking Studio`;
    renderNav(); renderTask(); renderResources(); renderPresets(); renderClock(); save();
  }
  function updateWordCount() {
    const count = $('student-notes').value.trim().split(/\s+/).filter(Boolean).length;
    $('notes-count').textContent = `${count} ${count===1?'word':'words'}`;
  }
  function goQuestion(i) {
    if (!Number.isInteger(i) || i<0 || i>=questionCount()) return;
    state.indices[indexKey()] = i;
    renderTask(); save();
    $('task-title').focus({preventScroll:true});
  }
  function switchPart(id) {
    if (id === state.part || !DATA.parts.some(p => p.id === id)) return;
    const wasRunning = timer.running;
    state.part = id;
    resetTimer(0);
    render();
    $('part-heading').scrollIntoView({behavior:'smooth',block:'start'});
    $('task-title').focus({preventScroll:true});
    if (wasRunning) toast('New part, fresh clock. Your notes are saved.');
  }
  function switchTheme(id) {
    if (!DATA.themes.some(t => t.id === id)) return;
    state.theme = id;
    resetTimer(0); render();
    $('theme-dialog').close();
    toast(`Ready to talk about ${theme().name.toLowerCase()}?`);
  }
  function renderPresets() {
    $('timer-caption').textContent = part().timerCaption;
    $('timer-presets').innerHTML = part().presets.map((p,i)=>`<button data-preset="${i}" class="${i===timer.preset?'selected':''}" aria-pressed="${i===timer.preset}">${escape(p[0])}</button>`).join('');
  }
  function resetTimer(preset = timer.preset) {
    const setting = part().presets[preset] || part().presets[0];
    timer = {duration:setting[1],remaining:setting[1],deadline:null,running:false,preset};
    renderPresets(); renderClock();
  }
  function syncTimer() {
    if (!timer.running) return;
    timer.remaining = Math.max(0,Math.ceil((timer.deadline-Date.now())/1000));
    if (timer.remaining === 0) { timer.running = false; timer.deadline = null; }
  }
  function renderClock() {
    const min = Math.floor(timer.remaining/60);
    const sec = timer.remaining%60;
    $('clock').textContent = `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    $('clock').setAttribute('aria-label',`${min} minutes ${sec} seconds remaining`);
    $('clock').classList.toggle('finished',timer.remaining===0);
    $('timer-start').innerHTML = timer.running ? '<span aria-hidden="true">Ⅱ</span> Pause clock' : timer.remaining === 0 ? '<span aria-hidden="true">↺</span> Start again' : timer.remaining < timer.duration ? '<span aria-hidden="true">▶</span> Resume clock' : '<span aria-hidden="true">▶</span> Start clock';
    $('timer-start').setAttribute('aria-pressed',String(timer.running));
    $('timer-progress').style.width = `${100*(timer.duration-timer.remaining)/timer.duration}%`;
    const message = timer.remaining===0 ? (state.part==='p2' && timer.preset===0 ? 'Preparation finished. Select “Speak · 2 min”, then start the clock yourself.' : 'Time is up. Finish your answer, then use the checklist below.') : timer.running ? (state.part==='p2' ? (timer.preset===0?'Preparation time. Make keyword notes.':'Speaking time. Tell your story aloud.') : 'Speaking time. Move through the questions at your own pace.') : timer.remaining<timer.duration ? 'Paused. Take a breath, then continue.' : 'Ready when you are.';
    if ($('timer-message').textContent !== message) $('timer-message').textContent = message;
  }
  function toggleTimer() {
    syncTimer();
    if (timer.running) { timer.running = false; timer.deadline = null; }
    else { if (timer.remaining===0) timer.remaining=timer.duration; timer.deadline = Date.now()+timer.remaining*1000; timer.running = true; }
    renderClock();
  }
  setInterval(() => { if (timer.running) { syncTimer(); renderClock(); } },200);
  document.addEventListener('visibilitychange', () => { syncTimer(); renderClock(); });
  function addToNotes(text) {
    const field = $('student-notes');
    const next = field.value + (field.value.trim()?'\n':'') + text;
    if (next.length > field.maxLength) { toast('Your notes are full. Export a copy before adding more.'); return; }
    field.value = next;
    const task = taskData(); task.notes = next; save(); updateWordCount();
    toast('Added to your notes. Make it your own.');
  }
  function openThemes() {
    $('theme-options').innerHTML = DATA.themes.map(t=>`<button class="theme-option ${t.id===state.theme?'selected':''}" data-theme="${t.id}" aria-pressed="${t.id===state.theme}"><span class="theme-emoji" style="background:${t.color}" aria-hidden="true">${t.icon}</span>${t.id===state.theme?'<span class="theme-selected">✓ Current theme</span>':''}<strong>${escape(t.name)}</strong><small>${escape(t.subtitle)}</small></button>`).join('');
    $('theme-dialog').showModal();
  }
  function showGuide(type) {
    if (type === 'how') {
      $('info-title').textContent = 'A practice routine that works for you.';
      $('info-content').innerHTML = `<p>Choose one of six contexts and carry it through all three parts. Work alone, with a partner or with your teacher.</p><ol><li><strong>Read the task.</strong> Think of a real experience or a position you can explain. Use the hints if you need a starting point.</li><li><strong>Find your language.</strong> Open the word bank for meanings and examples, or try a guiding phrase. Add useful language to your notes.</li><li><strong>Practise aloud.</strong> The clocks start only when you press Start. Pause, resume or reset whenever you need. Part 1 and Part 3 clocks cover the whole question set.</li><li><strong>For Part 2, prepare then speak.</strong> Start the one-minute preparation clock. When it finishes, select the two-minute speaking clock and start it manually. Try the brief follow-up questions afterwards.</li><li><strong>Reflect and repeat.</strong> Tick what you noticed, write one next step and mark the task as practised. This records your practice, not a score.</li></ol><div class="band-note">Notes and language support are training aids. In the real test, preparation notes are provided for Part 2. Our theme-linked Part 1 sets are designed for practice; the actual interview covers a range of familiar topics. The real Speaking test takes 11–14 minutes.</div><h3>Your work, on your device</h3><p>Notes, checklists and practice markers are saved in this browser, separately for every theme and task. They do not sync between devices. Export your theme practice to keep a text copy. Running clocks reset when you change part or theme, or reload the page; moving between questions in the same set keeps the clock going.</p><div class="source-links"><a href="https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking" target="_blank" rel="noopener noreferrer">Official test format ↗</a></div>`;
    } else {
      $('info-title').textContent = 'What makes effective speaking?';
      $('info-content').innerHTML = `<p>IELTS assesses four areas across the whole Speaking test. Use them to reflect on your practice. A ticked checklist does not predict a band score.</p><div class="guide-grid"><div class="guide-box"><h3>Fluency & coherence</h3><p>Keep speaking, develop relevant ideas and connect them in a way the listener can follow. Pauses to think are natural.</p></div><div class="guide-box"><h3>Lexical resource</h3><p>Choose vocabulary that communicates your meaning accurately. Explain an idea another way when the word you want is missing.</p></div><div class="guide-box"><h3>Grammatical range & accuracy</h3><p>Use both simple and complex sentence forms where appropriate, with control of grammar and tense.</p></div><div class="guide-box"><h3>Pronunciation</h3><p>Make yourself easy to understand through clear sounds, rhythm, stress and intonation. You do not need to imitate a particular accent.</p></div></div><h3>Useful development goals</h3><p><strong>Towards band 6:</strong> sustain longer answers, paraphrase when needed, combine short and complex forms, and make your meaning generally clear.</p><p><strong>Towards band 7:</strong> develop longer turns with connected ideas, use vocabulary flexibly, produce frequent accurate sentences, and improve control of your delivery.</p><p><strong>Towards band 8:</strong> develop ideas coherently, choose precise vocabulary, make most sentences accurate, and use stress and intonation flexibly.</p><div class="band-note">These are condensed learning goals based on the supplied public descriptors. They are not a complete scoring rubric. Qualified IELTS examiners assess performance across the test; this site provides no automated band scores.</div><div class="source-links"><a href="./ielts-speaking-band-descriptors.pdf" target="_blank" rel="noopener">Read the full band descriptors (PDF) ↗</a><a href="https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking" target="_blank" rel="noopener noreferrer">Official test format ↗</a></div>`;
    }
    $('info-dialog').showModal();
  }
  function exportPractice() {
    const t = theme();
    const lines = ['SPEAKING STUDIO — MY PRACTICE',t.name,t.context,`Exported: ${new Date().toLocaleString()}`,''];
    for (const p of DATA.parts) {
      lines.push(`PART ${p.id.slice(1)}: ${p.name.toUpperCase()}`,'');
      const prompts = p.id==='p2' ? [[t.p2.title, ...t.p2.bullets,t.p2.end].join('\n')] : t[p.id].map(q=>q[1]);
      prompts.forEach((prompt,i)=>{
        const task = taskData(`${t.id}-${p.id}-${i}`);
        lines.push(`Task ${i+1}: ${prompt}`,`Practice status: ${task.done?'Practised':'Not marked as practised'}`,'','MY NOTES',task.notes||'(No notes yet)','','MY CHECKLIST');
        DATA.checks[p.id].forEach((c,j)=>lines.push(`${task.checks[j]?'[x]':'[ ]'} ${c[0]} ${c[1]}`));
        lines.push('','MY NEXT STEP',task.next||'(No next step yet)','','------------------------------','');
      });
    }
    lines.push('Personal reflection only. This export is not an IELTS score.');
    const url = URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url; link.download = `speaking-studio-${t.id}-practice.txt`; document.body.append(link); link.click(); link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    toast('Your theme practice has been exported.');
  }
  document.addEventListener('click',event=>{
    const target = event.target.closest('button');
    if (!target) return;
    if (target.dataset.part) switchPart(target.dataset.part);
    if (target.dataset.question!==undefined) goQuestion(Number(target.dataset.question));
    if (target.dataset.theme) switchTheme(target.dataset.theme);
    if (target.dataset.preset!==undefined) { resetTimer(Number(target.dataset.preset)); }
    if (target.dataset.resource) { state.resource = target.dataset.resource; renderResources(); }
    if (target.dataset.addWord!==undefined) addToNotes(theme().words[state.part][Number(target.dataset.addWord)][0]);
    if (target.dataset.addPhrase!==undefined) {
      const phrases=[...DATA.phrases[state.part],['Connect to this theme',theme().starter[state.part]]];
      addToNotes(phrases[Number(target.dataset.addPhrase)][1]);
    }
    if (target.classList.contains('dialog-close')) target.closest('dialog').close();
    switch(target.id) {
      case 'previous-question': goQuestion(questionIndex()-1); break;
      case 'next-question': goQuestion(questionIndex()+1); break;
      case 'theme-button': case 'new-theme-button': openThemes(); break;
      case 'how-button': case 'how-footer': showGuide('how'); break;
      case 'assessment-button': case 'criteria-link': showGuide('assessment'); break;
      case 'timer-start': toggleTimer(); break;
      case 'timer-reset': resetTimer(); break;
      case 'download-button': exportPractice(); break;
      case 'complete-button': {
        const task = taskData(); task.done = !task.done; save(); renderNav(); renderTask();
        toast(task.done?'Practice logged. Every conversation counts.':'Task marked for another try.'); break;
      }
    }
  });
  $('student-notes').addEventListener('input',()=>{ const task=taskData();task.notes=$('student-notes').value;save();updateWordCount(); });
  $('next-step').addEventListener('input',()=>{const task=taskData();task.next=$('next-step').value;save();});
  $('checklist').addEventListener('change',event=>{
    if(event.target.dataset.check===undefined) return;
    const task=taskData();task.checks[Number(event.target.dataset.check)] = event.target.checked;
    save();$('checklist-count').textContent=`${task.checks.filter(Boolean).length} / 5`;
  });
  document.querySelector('.resource-tabs').addEventListener('keydown',event=>{
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();state.resource=event.key==='Home'?'words':event.key==='End'?'phrases':state.resource==='words'?'phrases':'words';renderResources();$(state.resource+'-tab').focus();
  });
  document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{
    if(event.target!==dialog) return;
    const r=dialog.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close();
  }));
  resetTimer(0); render();
})();
