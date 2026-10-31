'use strict';
(() => {
  const DATA = window.STUDIO;
  const PLAN = window.STUDIO_PLANNER;
  const LANGUAGE = window.STUDIO_LANGUAGE;
  const $ = (id) => document.getElementById(id);
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const highlightPrompt = (value) => escape(value).replace(/^(Describe|What|Why|How|Where|When|Who|Which|Would|Should|Could|Can|Do|Does|Did|Is|Are|Has|Have)\b/, '<mark class="prompt-highlight">$1</mark>');
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
    motion: saved.motion !== false
  };
  const STAGES = [
    {id:'question', label:'Question', title:'Meet your question', description:'Read it. Picture your answer.', symbol:'?'},
    {id:'plan', label:'Plan', title:'Collect a few good words', description:'Pick a section. Try a B2/C1 suggestion. Add your own keywords.', symbol:'✎'},
    {id:'layout', label:'Style', title:'Give your ideas a shape', description:'Choose the note style that helps you think.', symbol:'✦'},
    {id:'speak', label:'Speak', title:'Your voice. Your turn.', description:'Start the clock and bring your notes to life.', symbol:'♫'},
    {id:'review', label:'Review', title:'Look how far you’ve come', description:'A little reflection makes the next response stronger.', symbol:'✓'}
  ];
  let responseStarted = false;
  let toastTimeout;
  let timer = { duration:240, remaining:240, deadline:null, running:false, preset:0 };
  let prepTimer = {remaining:60,deadline:null,running:false};
  const theme = () => DATA.themes.find(t => t.id === state.theme);
  const part = () => DATA.parts.find(p => p.id === state.part);
  const questionCount = () => state.part === 'p2' ? 1 : theme()[state.part].length;
  const indexKey = () => `${state.theme}-${state.part}`;
  const questionIndex = () => {
    const n = state.indices[indexKey()];
    return Number.isInteger(n) && n >= 0 && n < questionCount() ? n : 0;
  };
  const taskKey = () => `${indexKey()}-${questionIndex()}`;
  function sectionsForTask(key=taskKey()) {
    const [themeId,partId,index]=key.split('-');
    return PLAN.sections(partId,DATA.themes.find(t=>t.id===themeId)||theme(),Number(index)||0);
  }
  function taskData(key = taskKey()) {
    let task = state.tasks[key];
    if (!task || typeof task !== 'object' || Array.isArray(task)) task = {};
    const result = {
      notes: typeof task.notes === 'string' ? task.notes.slice(0,15000) : '',
      planner: PLAN.normalize(task.planner,sectionsForTask(key),typeof task.notes==='string'?task.notes:''),
      next: typeof task.next === 'string' ? task.next.slice(0,2000) : '',
      checks: Array.from({length:5}, (_,i) => Array.isArray(task.checks) && task.checks[i] === true),
      done: task.done === true,
      stage: STAGES.some(s=>s.id===task.stage) ? task.stage : 'question',
      responseFinished: task.responseFinished === true
    };
    if (result.stage==='review' && !result.responseFinished) result.stage='question';
    if (result.stage==='speak' && !PLAN.ready(result.planner)) result.stage='plan';
    if (result.stage==='layout' && !PLAN.countWords(result.planner)) result.stage='plan';
    state.tasks[key] = result;
    return result;
  }
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({theme:state.theme,part:state.part,indices:state.indices,tasks:state.tasks,motion:state.motion}));
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
  function renderMotion() {
    const reduced = typeof matchMedia==='function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    $('journey-card').classList.toggle('motion-off',!state.motion || reduced);
    $('motion-toggle').textContent = reduced ? '✦ Reduced motion' : state.motion ? '✦ Motion on' : '✦ Motion off';
    $('motion-toggle').setAttribute('aria-pressed',String(state.motion && !reduced));
  }
  function animateMoment() {
    renderMotion();
    if ($('journey-card').classList.contains('motion-off')) return;
    const effects=$('stage-effects');
    effects.innerHTML=Array.from({length:9},(_,i)=>`<span style="--i:${i};--x:${8+i*10}%;--spin:${i%2?120:-110}deg">${i%3?'✦':'●'}</span>`).join('');
    const panel=$(STAGES.find(s=>s.id===taskData().stage).id==='plan'?'planner-builder':taskData().stage==='speak'?'response-stage':taskData().stage+'-stage');
    if(typeof panel.animate==='function') panel.animate([{opacity:.25,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'ease-out'});
  }
  function renderStage() {
    const task=taskData(), position=STAGES.findIndex(s=>s.id===task.stage), current=STAGES[position];
    const panels={question:'question-stage',plan:'planner-builder',layout:'layout-stage',speak:'response-stage',review:'review-stage'};
    for(const [stage,id] of Object.entries(panels)) $(id).hidden=stage!==current.id;
    $('journey-card').dataset.stage=current.id;
    $('stage-kicker').textContent=`STEP ${position+1} OF 5 · ${current.label.toUpperCase()}`;
    $('stage-title').textContent=current.title;
    $('stage-description').textContent=current.description;
    $('stage-symbol').textContent=current.symbol;
    $('task-anchor').classList.toggle('compact-question',current.id!=='question');
    $('journey-progress').innerHTML=STAGES.map((s,i)=>`<li class="${i===position?'current':i<position?'passed':''}" ${i===position?'aria-current="step"':''}><span>${i<position?'✓':i+1}</span><small>${s.label}</small></li>`).join('');
    $('choose-style').disabled=!PLAN.countWords(task.planner);
    $('planning-hint').textContent=PLAN.countWords(task.planner)?'Keywords saved. Ready for your layout?':'Add at least one keyword to continue.';
    $('next-task').hidden=questionIndex()===questionCount()-1 || !task.done;
    $('next-part').hidden=!task.done || questionIndex()<questionCount()-1;
    $('finish-response').disabled=!responseStarted;
    $('plan-count').hidden=!['plan','layout'].includes(current.id);
    renderMotion();
    if(current.id==='speak' && typeof requestAnimationFrame==='function')requestAnimationFrame(drawSpidergram);
  }
  function goStage(stage) {
    if(!STAGES.some(s=>s.id===stage))return false;
    const current=taskData();
    if(stage==='layout' && (current.stage!=='plan' && current.stage!=='speak' || !PLAN.countWords(current.planner)))return false;
    if(stage==='speak' && !PLAN.ready(current.planner))return false;
    if(stage==='review' && !current.responseFinished)return false;
    if(stage!=='speak')pauseResponse();
    if(stage!=='plan'){syncPrepClock();prepTimer.running=false;prepTimer.deadline=null;}
    const task=taskData();task.stage=stage;
    if(stage==='plan')task.planner.editing=true;
    save();renderPlanner();renderStage();animateMoment();
    $('journey-card').scrollIntoView({behavior:'auto',block:'start'});
    $('stage-title').focus({preventScroll:true});
    return true;
  }
  function finishResponse(expired=false) {
    if(taskData().stage!=='speak' || !responseStarted)return;
    if(!expired)pauseResponse();
    const task=taskData();task.responseFinished=true;task.stage='review';
    save();renderChecklist();renderStage();animateMoment();
    $('review-success').textContent=expired?'Time’s up — you did it. Let’s reflect.':'Response finished. You did it. Let’s reflect.';
    $('journey-card').scrollIntoView({behavior:'auto',block:'start'});
    $('stage-title').focus({preventScroll:true});
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
      $('task-content').innerHTML = `<h3 id="task-title" tabindex="-1">${highlightPrompt(cue.title)}</h3><p class="cue-lead">You should say:</p><ul class="cue-bullets">${cue.bullets.map(b=>`<li>${escape(b)}</li>`).join('')}</ul><p class="cue-end">${escape(cue.end).replace(/explain/, '<mark class="instruction-highlight">explain</mark>')}</p><details class="followups"><summary>Finish with a brief follow-up</summary><ul>${cue.followups.map(q=>`<li>${escape(q)}</li>`).join('')}</ul></details>`;
      $('question-navigation').innerHTML = '';
    } else {
      const question = t[state.part][i];
      $('task-content').innerHTML = `<div class="task-topic">${escape(question[0])}</div><h3 id="task-title" tabindex="-1">${highlightPrompt(question[1])}</h3><p class="task-tip"><strong>A way in:</strong> ${escape(question[2])}</p>`;
      $('question-navigation').innerHTML = `<div class="question-navigation"><div class="question-dots" aria-label="Choose a question">${t[state.part].map((q,j)=>`<button class="question-dot ${j===i?'active':''} ${taskData(`${indexKey()}-${j}`).done?'done':''}" data-question="${j}" aria-label="Question ${j+1}${taskData(`${indexKey()}-${j}`).done?', practised':''}" ${j===i?'aria-current="true"':''}>${j+1}</button>`).join('')}</div><div class="question-arrows"><button class="icon-button" id="previous-question" aria-label="Previous question" ${i===0?'disabled':''}>←</button><button class="icon-button" id="next-question" aria-label="Next question" ${i===count-1?'disabled':''}>→</button></div></div><details class="all-questions"><summary>See all ${count} questions in this set</summary><ol>${t[state.part].map((q,j)=>`<li><button data-question="${j}">${escape(q[1])}</button></li>`).join('')}</ol></details>`;
    }
    const task = taskData();
    $('next-step').value = task.next;
    $('next-step').setAttribute('aria-invalid','false');
    $('next-step-feedback').textContent='Keep your next goal to four words.';
    renderPlanner();
    renderChecklist();
    const partPosition = DATA.parts.findIndex(x => x.id === state.part);
    const next = DATA.parts[partPosition+1];
    $('next-part').innerHTML = next ? `<button class="text-button" data-part="${next.id}">Continue to Part ${partPosition+2} · ${escape(next.short)} <span aria-hidden="true">→</span></button>` : `<button class="text-button" id="new-theme-button">Try another theme <span aria-hidden="true">→</span></button>`;
    renderStage();
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
  function currentSuggestion() {
    const plan=taskData().planner,group=sectionsForTask().find(g=>g.id===plan.active);
    const bank=LANGUAGE.bank(state.part,theme(),questionIndex(),group);
    const index=(plan.suggestions[group.id]||0)%bank.length;
    return {plan,group,bank,index,item:bank[index]};
  }
  function renderSuggestion() {
    const {plan,group,bank,index,item}=currentSuggestion();
    const chosen=plan.groups[group.id].some(entry=>entry.text.toLocaleLowerCase()===item.text.toLocaleLowerCase());
    $('language-suggestion').innerHTML=`<div class="suggestion-topline"><span class="plan-mini-label">ONE IDEA FOR ${escape(group.label).toUpperCase()}</span><span class="language-level ${item.level==='C1'?'stretch':''}">${item.level==='C1'?'C1 stretch':'B2 focus'}</span></div><strong class="suggested-text">${escape(item.text)}</strong><p class="suggestion-meaning">${escape(item.meaning)}</p><div class="suggestion-actions"><button type="button" class="expression-option ${chosen?'chosen':''}" id="pick-suggestion" aria-label="${chosen?'Added':'Add'} ${escape(item.text)}${chosen?'':' to '+escape(group.label)}" ${chosen?'disabled':''}>${chosen?'Added ✓':'Add to my notes ＋'}</button><button type="button" id="another-suggestion" class="text-button" aria-label="Try another suggestion for ${escape(group.label)}">Try another <span aria-hidden="true">↻</span></button><span class="suggestion-count">${index+1} / ${bank.length}</span></div>`;
  }
  function render() {
    const p = part();
    $('main').dataset.part = state.part;
    $('theme-name').textContent = theme().name;
    $('theme-button').setAttribute('aria-label',`Change theme. Current theme: ${theme().name}`);
    $('breadcrumb-part').textContent = 'Part '+state.part.slice(1);
    $('part-kicker').textContent = p.kicker;
    $('part-heading').textContent = p.name;
    $('part-description').textContent = p.description;
    $('part-duration').textContent = p.duration;
    document.title = `${theme().name} · Part ${state.part.slice(1)} | Speaking Studio`;
    renderNav(); renderTask();  renderPresets(); renderClock(); save();
  }
  function renderPlanner() {
    const task=taskData(),plan=task.planner,groups=sectionsForTask();
    const ready=PLAN.ready(plan),keywordCount=PLAN.countWords(plan);
    $('preparation-tools').hidden=state.part!=='p2';
    $('legacy-notes-message').hidden=!task.notes;
    $('plan-count').textContent=`${keywordCount} target ${keywordCount===1?'entry':'entries'} · 4 words maximum per entry`;
    $('planner-section-tabs').innerHTML=groups.map((g,i)=>`<button class="plan-section-tab tone-${i}" role="tab" data-plan-section="${g.id}" id="plan-tab-${g.id}" aria-controls="planner-editor" aria-selected="${g.id===plan.active}" tabindex="${g.id===plan.active?0:-1}">${escape(g.label)} <span>${plan.groups[g.id].length}</span></button>`).join('');
    const active=groups.find(g=>g.id===plan.active)||groups[0];
    const tone=groups.indexOf(active);
    $('planner-editor').setAttribute('aria-labelledby',`plan-tab-${active.id}`);
    $('planner-editor').innerHTML=`<div class="plan-editor-panel tone-${tone}"><div class="plan-editor-heading"><div><h4>${escape(active.label)}</h4><p>${escape(active.hint)}</p></div><span class="four-word-badge">4 WORDS MAX</span></div><div id="language-suggestion" class="language-suggestion" aria-live="polite"></div><span class="plan-mini-label">YOUR WORDS & EXPRESSIONS</span><div class="selected-entries">${plan.groups[active.id].length?plan.groups[active.id].map((item,i)=>`<span class="plan-chip ${item.kind==='expression'?'expression-chip':'word-chip'}">${escape(item.text)}<button data-remove-entry="${i}" aria-label="Remove ${escape(item.text)} from ${escape(active.label)}">×</button></span>`).join(''):'<p class="empty-entries">Pick the suggestion or add your own target words.</p>'}</div><form id="planner-entry-form" novalidate><label for="planner-entry">Add a keyword or short expression</label><div class="planner-entry-row"><input id="planner-entry" type="text" autocomplete="off" maxlength="100" placeholder="e.g. quiet neighbourhood" aria-describedby="entry-feedback" aria-invalid="false"><button class="primary-button" id="add-plan-entry" type="submit" disabled>Add <span aria-hidden="true">＋</span></button></div><div id="entry-feedback" class="entry-feedback" role="status">0 / 4 words · Enter adds your entry.</div></form></div>`;
    renderSuggestion();
    $('layout-help').textContent=keywordCount?'Your words are saved. Choose how to organise them.':'Add at least one target word, then choose a layout.';
    document.querySelectorAll('[data-layout]').forEach(button=>{
      button.disabled=!keywordCount;
      button.setAttribute('aria-pressed',String(plan.mode===button.dataset.layout));
    });
    if(ready){
      const prompt=state.part==='p2'?theme().p2.title:theme()[state.part][questionIndex()][1];
      const cards=groups.map((g,i)=>`<section class="plan-branch tone-${i}" data-branch="${i}"><h5><span>${i+1}</span>${escape(g.label)}</h5><div class="branch-entries">${plan.groups[g.id].length?[...plan.groups[g.id]].sort((a,b)=>(a.kind==='expression'?0:1)-(b.kind==='expression'?0:1)).map(item=>`<span class="display-chip ${item.kind==='expression'?'display-expression':''}">${escape(item.text)}</span>`).join(''):'<span class="empty-branch">Optional · no entries yet</span>'}</div></section>`).join('');
      $('plan-display').innerHTML=plan.mode==='spidergram'?`<div class="spidergram branches-${groups.length}"><svg class="spider-lines" aria-hidden="true"></svg><div class="plan-hub"><span>MY RESPONSE</span><strong>${escape(prompt)}</strong></div>${cards}</div>`:`<div class="listing-plan"><p class="list-task">${escape(prompt)}</p>${cards}</div>`;
      if(plan.mode==='spidergram'&&typeof requestAnimationFrame==='function')requestAnimationFrame(drawSpidergram);
    }else $('plan-display').innerHTML='';
    renderPrepClock();renderClock();renderStage();
  }
  function drawSpidergram() {
    const container=document.querySelector('#plan-display .spidergram');
    if(!container||!container.querySelectorAll)return;
    const svg=container.querySelector('svg'),hub=container.querySelector('.plan-hub');
    if(!svg||!hub)return;
    const bounds=container.getBoundingClientRect(),center=hub.getBoundingClientRect();
    const cx=center.left+center.width/2-bounds.left,cy=center.top+center.height/2-bounds.top;
    svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
    svg.innerHTML=Array.from(container.querySelectorAll('.plan-branch')).map((node,i)=>{
      const r=node.getBoundingClientRect(),x=r.left+r.width/2-bounds.left,y=(r.top>center.top?r.top:r.bottom)-bounds.top;
      return `<path d="M ${cx} ${cy} Q ${cx} ${(cy+y)/2} ${x} ${y}" class="connector-${i}"/>`;
    }).join('');
  }
  function updateEntryFeedback() {
    const input=$('planner-entry'),v=PLAN.validate(input.value);
    $('entry-feedback').textContent=v.count>4?v.error:`${v.count} / 4 words · Enter adds your entry.`;
    $('entry-feedback').classList.toggle('entry-error',v.count>4);
    input.setAttribute('aria-invalid',String(v.count>4));
    $('add-plan-entry').disabled=!v.ok;
  }
  function addToPlan(text,kind='word',preserveDraft=false) {
    if(taskData().stage!=='plan')return false;
    const draft=preserveDraft?$('planner-entry').value:'';
    const task=taskData(),result=PLAN.add(task.planner,task.planner.active,text,kind);
    if(!result.ok){toast(result.error);return false;}
    save();renderPlanner();
    if(preserveDraft){$('planner-entry').value=draft;updateEntryFeedback();}
    if(state.motion && typeof $('planner-editor').animate==='function' && !$('journey-card').classList.contains('motion-off')) $('planner-editor').animate([{transform:'scale(.99)'},{transform:'scale(1)'}],{duration:220});
    toast(`Added to ${sectionsForTask().find(g=>g.id===task.planner.active).label}.`);
    return true;
  }
  function pauseResponse() {
    syncTimer();timer.running=false;timer.deadline=null;renderClock();
  }
  function goQuestion(i) {
    if (!Number.isInteger(i) || i<0 || i>=questionCount() || i===questionIndex()) return;
    pauseResponse();resetPrepClock();
    state.indices[indexKey()] = i;
    resetTimer(0);renderTask();save();animateMoment();
    $('stage-title').focus({preventScroll:true});
  }
  function switchPart(id) {
    if (id === state.part || !DATA.parts.some(p => p.id === id)) return;
    const wasRunning = timer.running;
    state.part = id;
    resetPrepClock();
    resetTimer(0);
    render();
    $('part-heading').scrollIntoView({behavior:'auto',block:'start'});
    $('stage-title').focus({preventScroll:true});
    if (wasRunning) toast('New part, fresh clock. Your notes are saved.');
  }
  function switchTheme(id) {
    if (!DATA.themes.some(t => t.id === id)) return;
    state.theme = id;
    resetPrepClock();
    if(typeof matchMedia==='function')matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',renderMotion);
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
    responseStarted=false;
    timer = {duration:setting[1],remaining:setting[1],deadline:null,running:false,preset};
    renderPresets(); renderClock();
  }
  function syncTimer() {
    if (!timer.running) return;
    timer.remaining = Math.max(0,Math.ceil((timer.deadline-Date.now())/1000));
    if (timer.remaining === 0) { timer.running = false; timer.deadline = null; finishResponse(true); }
  }
  function renderClock() {
    const min = Math.floor(timer.remaining/60);
    const sec = timer.remaining%60;
    $('clock').textContent = `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    $('clock').setAttribute('aria-label',`${min} minutes ${sec} seconds remaining`);
    $('clock').classList.toggle('finished',timer.remaining===0);
    $('timer-start').innerHTML = timer.running ? '<span aria-hidden="true">Ⅱ</span> Pause clock' : timer.remaining === 0 ? '<span aria-hidden="true">↺</span> Start again' : timer.remaining < timer.duration ? '<span aria-hidden="true">▶</span> Resume clock' : '<span aria-hidden="true">▶</span> Start clock';
    $('timer-start').setAttribute('aria-pressed',String(timer.running));
    $('timer-start').disabled=taskData().stage!=='speak'||!PLAN.ready(taskData().planner);
    $('finish-response').disabled=!responseStarted;
    $('journey-card').classList.toggle('is-speaking',timer.running);
    $('timer-progress').style.width = `${100*(timer.duration-timer.remaining)/timer.duration}%`;
    const message = !PLAN.ready(taskData().planner)?'Add target words and choose a layout before speaking.':timer.remaining===0?'Time is up. Finish your answer, then reflect on your response.':timer.running?'Speaking time. Follow your keywords and make sentences aloud.':timer.remaining<timer.duration?'Paused. Take a breath, then continue.':'Your plan is ready. Start the clock when you are.';
    if ($('timer-message').textContent !== message) $('timer-message').textContent = message;
  }
  function toggleTimer() {
    if(taskData().stage!=='speak'||!PLAN.ready(taskData().planner)){toast('Add target words, then choose Spidergram or Listing first.');return;}
    syncTimer();
    if(taskData().stage!=='speak')return;
    if (timer.running) { timer.running = false; timer.deadline = null; }
    else { if (timer.remaining===0) timer.remaining=timer.duration; timer.deadline = Date.now()+timer.remaining*1000; timer.running = true; responseStarted=true; const task=taskData();task.responseFinished=false;task.done=false;save(); }
    renderClock();
  }
  function syncPrepClock() {
    if(!prepTimer.running)return;
    prepTimer.remaining=Math.max(0,Math.ceil((prepTimer.deadline-Date.now())/1000));
    if(!prepTimer.remaining){prepTimer.running=false;prepTimer.deadline=null;}
  }
  function renderPrepClock() {
    const min=Math.floor(prepTimer.remaining/60),sec=prepTimer.remaining%60;
    $('prep-clock').textContent=`${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    $('prep-clock').setAttribute('aria-label',`${min} minutes ${sec} seconds of preparation remaining`);
    $('prep-start').textContent=prepTimer.running?'Pause preparation':prepTimer.remaining===0?'Restart preparation':prepTimer.remaining<60?'Resume preparation':'Start preparation';
    const message=prepTimer.remaining===0?'Preparation finished. Choose your layout, then start speaking yourself.':prepTimer.running?'Planning time. Collect keywords; four words per entry.':prepTimer.remaining<60?'Preparation paused.':'Start this optional clock when you begin planning.';
    if($('prep-status').textContent!==message)$('prep-status').textContent=message;
  }
  function resetPrepClock() {prepTimer={remaining:60,deadline:null,running:false};renderPrepClock();}
  function togglePrepClock() {
    if(state.part!=='p2'||taskData().stage!=='plan')return;
    syncPrepClock();
    if(prepTimer.running){prepTimer.running=false;prepTimer.deadline=null;}
    else{if(!prepTimer.remaining)prepTimer.remaining=60;prepTimer.deadline=Date.now()+prepTimer.remaining*1000;prepTimer.running=true;}
    renderPrepClock();
  }
  setInterval(() => {if(timer.running){syncTimer();renderClock();}if(prepTimer.running){syncPrepClock();renderPrepClock();}},200);
  document.addEventListener('visibilitychange',()=>{syncTimer();renderClock();syncPrepClock();renderPrepClock();});
  function openThemes() {
    $('theme-options').innerHTML = DATA.themes.map(t=>`<button class="theme-option ${t.id===state.theme?'selected':''}" data-theme="${t.id}" aria-pressed="${t.id===state.theme}"><span class="theme-emoji" style="background:${t.color}" aria-hidden="true">${t.icon}</span>${t.id===state.theme?'<span class="theme-selected">✓ Current theme</span>':''}<strong>${escape(t.name)}</strong><small>${escape(t.subtitle)}</small></button>`).join('');
    $('theme-dialog').showModal();
  }
  function showGuide(type) {
    if (type === 'how') {
      $('info-title').textContent = 'A practice routine that works for you.';
      $('info-content').innerHTML = `<p>Choose a context and carry it through all three parts. Work alone, with a partner or with your teacher.</p><ol><li><strong>Read the task.</strong> Think of a real experience or a position you can explain.</li><li><strong>Collect words.</strong> Choose a task-specific section such as Reason or Example. Each section offers one relevant B2/C1 word or phrase, with a meaning. Pick it, try another from that section’s bank, or enter your own keywords. The full question stays visible in every step. Every entry has a strict four-word limit, including pasted text.</li><li><strong>Choose your layout.</strong> After adding at least one target word, choose Spidergram or Listing. Your selected expressions and keywords become a speaking plan. Only this step is shown until you choose a layout.</li><li><strong>Speak from the plan.</strong> The response clock appears with your plan. Start it yourself and build full sentences aloud. Editing pauses the response clock. A new question gets a fresh clock.</li><li><strong>For Part 2, prepare then speak.</strong> Use the optional one-minute preparation clock while collecting words. Choose a layout, then manually start the two-minute response clock. The clocks never start each other.</li><li><strong>Reflect and repeat.</strong> The checklist appears after the clock ends or you press I’ve finished. Tick what went well and add a next goal of up to four words. Marking a task as practised does not award a score.</li></ol><div class="band-note">Planning support is a training aid. The real test provides preparation notes for Part 2. Our theme-linked Part 1 sets are learning activities; the actual interview covers a range of familiar topics. The real Speaking test takes 11–14 minutes.</div><h3>Your work, on your device</h3><p>Each task’s words, bank choices, chosen layout, checklists and practice markers are saved in this browser. They do not sync between devices. Export your theme practice to keep a copy. Original notes from the earlier version are retained in your export and imported as short entries. Your current step is saved too. Clocks reset on reload or a new task. Turn motion off with the button above your task; reduced-motion device settings are always respected.</p><div class="source-links"><a href="https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking" target="_blank" rel="noopener noreferrer">Official test format ↗</a></div>`;
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
        lines.push(`Task ${i+1}: ${prompt}`,`Practice status: ${task.done?'Practised':'Not marked as practised'}`,`Note-taking layout: ${task.planner.mode||'Not chosen yet'}`,'','MY SPEAKING PLAN');
        for(const group of sectionsForTask(`${t.id}-${p.id}-${i}`)){
          lines.push(group.label.toUpperCase());
          const entries=task.planner.groups[group.id];
          lines.push(...(entries.length?entries.map(item=>`- ${item.text}${item.kind==='expression'?' (starter)':''}`):['(No entries yet)']),'');
        }
        if(task.notes)lines.push('ORIGINAL NOTES FROM EARLIER VERSION',task.notes,'');
        lines.push('MY CHECKLIST');
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
    if (target.dataset.planSection) {const task=taskData();task.planner.active=target.dataset.planSection;save();renderPlanner();}
    if (target.dataset.removeEntry!==undefined){const task=taskData();PLAN.remove(task.planner,task.planner.active,Number(target.dataset.removeEntry));save();renderPlanner();}
    if (target.dataset.layout){const task=taskData();if(['layout','speak'].includes(task.stage)&&PLAN.chooseMode(task.planner,target.dataset.layout)){save();goStage('speak');}}
    if (target.classList.contains('dialog-close')) target.closest('dialog').close();
    switch(target.id) {
      case 'pick-suggestion': {if(taskData().stage==='plan'){const {item}=currentSuggestion();addToPlan(item.text,item.kind,true);}break;}
      case 'another-suggestion': {
        if(taskData().stage!=='plan')break;
        const {group,bank,index}=currentSuggestion(),task=taskData();
        task.planner.suggestions[group.id]=(index+1)%bank.length;save();renderSuggestion();$('another-suggestion').focus();break;
      }
      case 'previous-question': goQuestion(questionIndex()-1); break;
      case 'next-question': goQuestion(questionIndex()+1); break;
      case 'theme-button': case 'new-theme-button': openThemes(); break;
      case 'how-button': case 'how-footer': showGuide('how'); break;
      case 'assessment-button': case 'criteria-link': showGuide('assessment'); break;
      case 'timer-start': toggleTimer(); break;
      case 'timer-reset': resetTimer(); break;
      case 'prep-start': togglePrepClock(); break;
      case 'prep-reset': resetPrepClock(); break;
      case 'begin-planning': case 'edit-plan': case 'back-plan': goStage('plan'); break;
      case 'choose-style': case 'back-style': goStage('layout'); break;
      case 'back-question': goStage('question'); break;
      case 'finish-response': finishResponse(); break;
      case 'retry-response': {resetTimer(0);goStage('speak');break;}
      case 'next-task': if(taskData().done)goQuestion(questionIndex()+1);break;
      case 'motion-toggle': state.motion=!state.motion;save();renderMotion();break;
      case 'download-button': exportPractice(); break;
      case 'complete-button': {
        if(taskData().stage!=='review')break;
        const task = taskData(); task.done = !task.done; save(); renderNav(); renderTask();animateMoment();
        toast(task.done?'Practice logged. Every conversation counts.':'Task marked for another try.'); break;
      }
    }
  });
  document.addEventListener('submit',event=>{
    if(event.target.id!=='planner-entry-form')return;
    event.preventDefault();
    const value=$('planner-entry').value;
    if(addToPlan(value)){$('planner-entry').focus();updateEntryFeedback();}else updateEntryFeedback();
  });
  document.addEventListener('input',event=>{if(event.target.id==='planner-entry')updateEntryFeedback();});
  $('next-step').addEventListener('input',()=>{
    const field=$('next-step'),v=PLAN.validate(field.value),valid=v.ok||!v.count;
    field.setAttribute('aria-invalid',String(!valid));
    $('next-step-feedback').textContent=valid?'Keep your next goal to four words.':v.error;
    $('next-step-feedback').classList.toggle('entry-error',!valid);
    if(valid){const task=taskData();task.next=v.text;save();}
  });
  $('checklist').addEventListener('change',event=>{
    if(event.target.dataset.check===undefined) return;
    const task=taskData();task.checks[Number(event.target.dataset.check)] = event.target.checked;
    save();$('checklist-count').textContent=`${task.checks.filter(Boolean).length} / 5`;
  });
  $('planner-section-tabs').addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();const task=taskData(),groups=sectionsForTask(),index=groups.findIndex(g=>g.id===task.planner.active);
    const next=event.key==='Home'?0:event.key==='End'?groups.length-1:(index+(event.key==='ArrowRight'?1:-1)+groups.length)%groups.length;
    task.planner.active=groups[next].id;save();renderPlanner();$(`plan-tab-${groups[next].id}`).focus();
  });
  document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{
    if(event.target!==dialog) return;
    const r=dialog.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close();
  }));
  if(typeof ResizeObserver==='function')new ResizeObserver(drawSpidergram).observe($('plan-display'));
  if(typeof matchMedia==='function')matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',renderMotion);
  resetTimer(0); render();
})();
